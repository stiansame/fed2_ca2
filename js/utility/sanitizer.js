// Function to convert < and > to their HTML entities
export function sanitizeHtml(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
