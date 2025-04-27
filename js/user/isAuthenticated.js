/**
 * Checks if the current user is authenticated by verifying JWT token
 *
 * @returns {boolean} - True if user is authenticated, false otherwise
 *
 * @example
 * if (isAuthenticated()) {
 *   // Show user-specific content
 *   showUserDashboard();
 * } else {
 *   // Redirect to login
 *   redirectToLogin();
 * }
 */
function isAuthenticated() {
  // Retrieve token from localStorage
  const token = localStorage.getItem("accessToken");

  // If no token exists, user is not authenticated
  if (!token) {
    return false;
  }

  try {
    // Basic token structure validation
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      return false;
    }

    // Check token expiration
    const payload = JSON.parse(atob(tokenParts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // If token has expired, user is not authenticated
    if (payload.exp && payload.exp < currentTime) {
      // Clear invalid token
      localStorage.removeItem("accessToken");
      return false;
    }

    // Token exists and is not expired
    return true;
  } catch (error) {
    // If token parsing fails, it's invalid
    console.error("Invalid token format:", error);
    localStorage.removeItem("accessToken");
    return false;
  }
}

/*
Key aspects:

Token retrieval and basic validation:

Checks for token existence in localStorage
Validates the basic JWT structure (three parts separated by periods)


Expiration check:

Decodes the payload portion of the JWT
Compares the expiration timestamp with the current time
Automatically clears expired tokens from localStorage


Error handling:

Handles potential errors during token parsing
Removes invalid tokens to prevent future issues
Logs errors for debugging purposes


Security considerations:

This is a client-side check only, providing user experience benefits
All secure operations still require server-side authentication
Does not validate the token signature cryptographically (this is done server-side)


Usage contexts:

Used to conditionally render UI elements based on authentication status
Controls access to protected routes (create post, profile editing, etc.)
Determines visibility of authenticated-only features



These functions together form a critical part of the application's security layer, ensuring that only authenticated users with valid Noroff email addresses can access the platform's features.
*/
