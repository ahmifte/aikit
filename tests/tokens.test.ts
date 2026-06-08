import { describe, it, expect } from "vitest";
import { countTokens, truncateToTokenLimit } from "../src/tokens.js";

describe("countTokens", () => {
  it("returns 0 for empty input", () => {
    expect(countTokens("")).toBe(0);
  });

  it("scales with text length", () => {
    const short = countTokens("hello world");
    const long = countTokens("hello world ".repeat(50));
    expect(long).toBeGreaterThan(short);
  });

  it("never returns a negative number", () => {
    expect(countTokens("a")).toBeGreaterThanOrEqual(1);
  });
});

describe("truncateToTokenLimit", () => {
  it("returns text unchanged when under the limit", () => {
    const text = "a short sentence";
    expect(truncateToTokenLimit(text, 100)).toBe(text);
  });

  it("returns an empty string for a non-positive limit", () => {
    expect(truncateToTokenLimit("anything", 0)).toBe("");
  });

  it("shrinks text to fit the limit", () => {
    const text = "word ".repeat(200).trim();
    const result = truncateToTokenLimit(text, 10);
    expect(countTokens(result)).toBeLessThanOrEqual(10);
    expect(result.length).toBeLessThan(text.length);
  });
});
