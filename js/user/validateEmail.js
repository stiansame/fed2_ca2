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
function validateEmail(email) {
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

/*
Key aspects:

Two-step validation process:

First checks if the string follows a basic email format using a regular expression
Then specifically verifies the domain is one of the approved Noroff domains


Case-insensitivity:

Converts email to lowercase before checking domains to handle mixed-case inputs


Security considerations:

This validation should be performed both client-side (for immediate user feedback) and server-side (for actual security)
The function prevents non-Noroff users from registering


Usage contexts:

Used during registration to validate new user emails
Could also be used when validating login credentials
*/
