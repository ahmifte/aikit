export interface ChunkOptions {
  /** Maximum chunk size in characters. Default: 1000. */
  chunkSize?: number;
  /** Number of characters of overlap carried between consecutive chunks. Default: 100. */
  overlap?: number;
}

/**
 * Split text into overlapping chunks suitable for embedding and retrieval.
 *
 * Chunks are sized by characters and break on the nearest whitespace before the
 * limit so words are not split mid-token. Consecutive chunks overlap by
 * `overlap` characters to preserve context across boundaries.
 *
 * @param text - The input text.
 * @param options - Chunk sizing options.
 * @returns An array of chunk strings (empty array for empty input).
 * @throws If `overlap` is negative or not smaller than `chunkSize`.
 */
export function chunkText(text: string, options: ChunkOptions = {}): string[] {
  const chunkSize = options.chunkSize ?? 1000;
  // Default overlap scales with chunkSize so a small explicit chunkSize never
  // collides with a fixed default and throws.
  const overlap = options.overlap ?? Math.min(100, Math.floor(chunkSize / 5));

  if (chunkSize <= 0) throw new Error("chunkSize must be greater than 0");
  if (overlap < 0) throw new Error("overlap must be >= 0");
  if (overlap >= chunkSize) {
    throw new Error("overlap must be smaller than chunkSize");
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) return [];
  if (trimmed.length <= chunkSize) return [trimmed];

  const chunks: string[] = [];
  let start = 0;

  while (start < trimmed.length) {
    let end = Math.min(start + chunkSize, trimmed.length);

    // If we're not at the very end, try to break on whitespace so we don't
    // cut a word in half.
    if (end < trimmed.length) {
      const slice = trimmed.slice(start, end);
      const lastSpace = slice.lastIndexOf(" ");
      if (lastSpace > chunkSize * 0.5) {
        end = start + lastSpace;
      }
    }

    const chunk = trimmed.slice(start, end).trim();
    if (chunk.length > 0) chunks.push(chunk);

    if (end >= trimmed.length) break;
    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}
