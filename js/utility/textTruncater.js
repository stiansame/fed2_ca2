export function truncateTextAtWordBoundary(text, maxLength = 100) {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  const cleanText = truncated.slice(0, lastSpace);

  return `${cleanText}...<b><em>[Click post to read more👀]</em></b>`;
}
