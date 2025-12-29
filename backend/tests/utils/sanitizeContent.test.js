const sanitizeContent = require("../../src/utils/sanitize");

describe("sanitizeContent", () => {
  test("removes script tags", () => {
    const input = `<p>Hello</p><script>alert("xss")</script>`;
    const result = sanitizeContent(input);

    expect(result).toBe("<p>Hello</p>");
  });

  test("allows basic formatting tags", () => {
    const input = `<p><strong>Bold</strong> <em>Italic</em></p>`;
    const result = sanitizeContent(input);

    expect(result).toContain("<strong>Bold</strong>");
    expect(result).toContain("<em>Italic</em>");
  });

  test("removes disallowed attributes", () => {
    const input = `<p onclick="alert(1)">Hello</p>`;
    const result = sanitizeContent(input);

    expect(result).toBe("<p>Hello</p>");
  });

  test("allows safe links", () => {
    const input = `<a href="https://example.com">Link</a>`;
    const result = sanitizeContent(input);

    expect(result).toContain('href="https://example.com"');
  });
});
