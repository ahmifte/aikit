/**
 * Estimate the number of tokens in a string.
 *
 * This is a fast, dependency-free heuristic — not a model-exact BPE tokenizer.
 * It blends a word count with a characters-per-token floor, which tracks real
 * GPT-style tokenization closely enough for budgeting and truncation. When you
 * need exact counts (e.g. hard API limits), pair this with a real tokenizer.
 *
 * @param text - The input text.
 * @param _model - Accepted for API symmetry; the estimate is model-agnostic.
 * @returns An estimated token count (always >= 0).
 */
export function countTokens(text: string, _model?: string): number {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  // Roughly 4 characters per token is the common English approximation.
  return Math.max(words, Math.ceil(chars / 4));
}

/**
 * Truncate text so its estimated token count does not exceed `limit`.
 *
 * Uses the {@link countTokens} estimate, trimming from the end and refining
 * until the budget is met. Word boundaries are preserved where possible.
 *
 * @param text - The input text.
 * @param limit - Maximum number of estimated tokens to keep.
 * @param model - Optional model hint, forwarded to {@link countTokens}.
 * @returns The (possibly truncated) text.
 */
export function truncateToTokenLimit(
  text: string,
  limit: number,
  model?: string,
): string {
  if (limit <= 0) return "";
  if (countTokens(text, model) <= limit) return text;

  // Start from a character estimate, then shrink until within budget.
  let truncated = text.slice(0, Math.max(1, limit * 4));
  while (truncated.length > 0 && countTokens(truncated, model) > limit) {
    truncated = truncated.slice(0, Math.floor(truncated.length * 0.9));
  }

  // Avoid ending mid-word when there is a nearby space to break on.
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > truncated.length * 0.8) {
    truncated = truncated.slice(0, lastSpace);
  }

  return truncated.trimEnd();
}
