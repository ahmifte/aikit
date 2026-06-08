import { describe, it, expect } from "vitest";
import { chunkText } from "../src/chunking.js";

describe("chunkText", () => {
  it("returns an empty array for empty input", () => {
    expect(chunkText("")).toEqual([]);
    expect(chunkText("   ")).toEqual([]);
  });

  it("returns a single chunk when text fits", () => {
    const text = "short text";
    expect(chunkText(text, { chunkSize: 100 })).toEqual([text]);
  });

  it("splits long text into multiple chunks", () => {
    const text = "word ".repeat(500).trim();
    const chunks = chunkText(text, { chunkSize: 100, overlap: 20 });
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(100);
    }
  });

  it("creates overlapping context between chunks", () => {
    const text = Array.from({ length: 200 }, (_, i) => `t${i}`).join(" ");
    const chunks = chunkText(text, { chunkSize: 80, overlap: 20 });
    expect(chunks.length).toBeGreaterThan(2);
  });

  it("throws when overlap is not smaller than chunkSize", () => {
    expect(() => chunkText("abc", { chunkSize: 10, overlap: 10 })).toThrow();
    expect(() => chunkText("abc", { chunkSize: 10, overlap: -1 })).toThrow();
  });

  it("reconstructs the original words across chunks", () => {
    const text = "one two three four five six seven eight nine ten";
    const chunks = chunkText(text, { chunkSize: 15, overlap: 0 });
    const joined = chunks.join(" ");
    for (const word of text.split(" ")) {
      expect(joined).toContain(word);
    }
  });
});
