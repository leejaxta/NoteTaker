import { stripHtmlAndTruncate } from "../../src/utils/text.js";

describe("stripHtmlAndTruncate", () => {
  test("removes HTML tags", () => {
    const input = "<p>Hello <strong>World</strong></p>";
    const result = stripHtmlAndTruncate(input);
    expect(result).toBe("Hello World");
  });

  test("truncates text longer than maxLength", () => {
    const input = "a".repeat(200);
    const result = stripHtmlAndTruncate(input, 50);
    expect(result.length).toBe(50);
    expect(result).toBe("a".repeat(50));
  });

  test("does not truncate if text is shorter than maxLength", () => {
    const input = "Short text";
    const result = stripHtmlAndTruncate(input, 50);
    expect(result).toBe("Short text");
  });

  test("returns empty string for empty or null input", () => {
    expect(stripHtmlAndTruncate("")).toBe("");
    expect(stripHtmlAndTruncate(null)).toBe("");
    expect(stripHtmlAndTruncate(undefined)).toBe("");
  });

  test("truncates and removes HTML tags at the same time", () => {
    const input = "<p>" + "x".repeat(200) + "</p>";
    const result = stripHtmlAndTruncate(input, 100);
    expect(result.length).toBe(100);
  });
});
