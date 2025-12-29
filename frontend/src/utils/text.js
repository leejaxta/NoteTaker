export const stripHtmlAndTruncate = (html, maxLength = 150) => {
  if (!html) return "";

  const text = html.replace(/<[^>]*>/g, "");
  return text.length > maxLength
    ? text.substring(0, maxLength)
    : text;
};
