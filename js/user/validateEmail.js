/**
 * Validates if an email address is from an approved Noroff domain
 *
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 *
 * @example
 * // Returns true
 * validateEmail("student@stud.noroff.no");
 *
 * // Returns true
 * validateEmail("teacher@noroff.no");
 *
 * // Returns false
 * validateEmail("user@gmail.com");
 */
export function validateEmail(email) {
  // Basic email format check using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  // Check specifically for Noroff domains
  const allowedDomains = ["@noroff.no", "@stud.noroff.no"];

  // Convert email to lowercase for case-insensitive comparison
  const lowerCaseEmail = email.toLowerCase();

  // Check if the email ends with any of the allowed domains
  return allowedDomains.some((domain) => lowerCaseEmail.endsWith(domain));
}
