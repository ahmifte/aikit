import { describe, it, expect } from "vitest";
import { buildPrompt } from "../src/prompts.js";

describe("buildPrompt", () => {
  it("replaces placeholders with values", () => {
    const out = buildPrompt("Hello {{name}}, you are {{age}}", {
      name: "Sam",
      age: 30,
    });
    expect(out).toBe("Hello Sam, you are 30");
  });

  it("tolerates whitespace inside placeholders", () => {
    expect(buildPrompt("{{ greeting }} world", { greeting: "hi" })).toBe(
      "hi world",
    );
  });

  it("supports repeated placeholders", () => {
    expect(buildPrompt("{{x}}-{{x}}", { x: "a" })).toBe("a-a");
  });

  it("throws on a missing variable", () => {
    expect(() => buildPrompt("Hello {{name}}", {})).toThrow(/name/);
  });

  it("coerces boolean and number values", () => {
    expect(buildPrompt("{{flag}}:{{n}}", { flag: true, n: 0 })).toBe("true:0");
  });
});
