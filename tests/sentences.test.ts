import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { cleanText, sentenceKey } from "../src/index.js";

describe("cleanText", () => {
  it("joins line-end hyphenation and collapses whitespace", () => {
    expect(cleanText("  The imple-\n  mentation   is\nsimple. ")).toBe("The implementation is simple.");
  });

  it("keeps real hyphens between words", () => {
    expect(cleanText("a real-time system")).toBe("a real-time system");
  });
});

describe("sentenceKey", () => {
  it("is the SHA-256 of the cleaned text", async () => {
    const expected = createHash("sha256").update("We ran it.").digest("hex");
    expect(await sentenceKey("We ran it.")).toBe(expected);
    expect(await sentenceKey("  We   ran\nit. ")).toBe(expected);
  });
});
