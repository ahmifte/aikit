/**
 * Compute the cosine similarity between two equal-length vectors.
 *
 * Returns a value in the range [-1, 1], where 1 means identical direction.
 * Returns 0 when either vector has zero magnitude.
 *
 * @param a - First vector (e.g. an embedding).
 * @param b - Second vector of the same length.
 * @returns The cosine similarity.
 * @throws If the vectors have different lengths.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("cosineSimilarity: vectors must have the same length");
  }
  if (a.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i] as number;
    const bi = b[i] as number;
    dot += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Rank candidate vectors by cosine similarity to a query vector.
 *
 * @param query - The query embedding.
 * @param candidates - Candidate embeddings to score.
 * @param topK - Optional cap on the number of results returned.
 * @returns Candidate indices and scores, sorted by descending similarity.
 */
export function topKSimilar(
  query: number[],
  candidates: number[][],
  topK?: number,
): Array<{ index: number; score: number }> {
  const scored = candidates.map((candidate, index) => ({
    index,
    score: cosineSimilarity(query, candidate),
  }));
  scored.sort((x, y) => y.score - x.score);
  return typeof topK === "number" ? scored.slice(0, topK) : scored;
}
