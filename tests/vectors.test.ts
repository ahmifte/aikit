import { describe, it, expect } from "vitest";
import { cosineSimilarity, topKSimilar } from "../src/vectors.js";

describe("cosineSimilarity", () => {
  it("returns 1 for identical vectors", () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1);
  });

  it("returns 0 for orthogonal vectors", () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
  });

  it("returns -1 for opposite vectors", () => {
    expect(cosineSimilarity([1, 0], [-1, 0])).toBeCloseTo(-1);
  });

  it("returns 0 when a vector is all zeros", () => {
    expect(cosineSimilarity([0, 0], [1, 1])).toBe(0);
  });

  it("throws on length mismatch", () => {
    expect(() => cosineSimilarity([1, 2], [1])).toThrow();
  });
});

describe("topKSimilar", () => {
  it("ranks candidates by similarity and respects topK", () => {
    const query = [1, 0];
    const candidates = [
      [1, 0],
      [0, 1],
      [0.9, 0.1],
    ];
    const ranked = topKSimilar(query, candidates, 2);
    expect(ranked).toHaveLength(2);
    expect(ranked[0]?.index).toBe(0);
    expect(ranked[1]?.index).toBe(2);
  });
});
