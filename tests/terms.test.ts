import { describe, expect, it } from "vitest";
import { buildMatcher, mergePatterns, patternFor, termKey, tokenize } from "../src/index.js";

describe("termKey", () => {
  it("lowercases and collapses whitespace", () => {
    expect(termKey("Run")).toBe("run");
    expect(termKey("  Carry   Out ")).toBe("carry out");
  });

  it("normalizes curly apostrophes", () => {
    expect(termKey("o’clock")).toBe("o'clock");
  });

  it("gives inflections of one lemma the same key", () => {
    expect(termKey("run")).toBe(termKey("RUN"));
  });
});

describe("mergePatterns", () => {
  it("unions the accepted lemmas per word position", () => {
    const merged = mergePatterns(patternFor(["running"], ["run"]), patternFor(["ran"], ["run"]));
    expect(merged).toHaveLength(1);
    expect(merged[0]).toEqual(expect.arrayContaining(["running", "ran", "run"]));
  });

  it("keeps the first pattern when the word counts differ", () => {
    const a = patternFor(["carry", "out"]);
    expect(mergePatterns(a, patternFor(["carry"]))).toBe(a);
  });
});

describe("matcher with string ids", () => {
  it("works when terms are identified by their key", () => {
    const matcher = buildMatcher([{ id: "run", status: "unknown" as const, pattern: patternFor(["ran"], ["run"]) }]);
    expect(matcher.findExact(tokenize("running"))?.id).toBe("run");
    expect(matcher.findAll(tokenize("She runs daily.")).map((m) => m.termId)).toEqual(["run"]);
  });
});
