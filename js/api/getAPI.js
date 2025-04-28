import { API_BASE } from "./apiEndpoints.js";
import { getFromLocalStorage } from "../user/localStorage.js";
import { socialKey } from "./apiKeys.js";

export async function apiGet(endpoint, params = {}, requiresAuth = true) {
  try {
    // Construct the full URL with query parameters
    const url = new URL(API_BASE + endpoint);

    // Add query parameters to URL
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    // Prepare request headers
    const headers = {
      "Content-Type": "application/json",
    };

    // Add authorization token if required
    if (requiresAuth) {
      const token = getFromLocalStorage("accessToken");
      if (!token) {
        throw new Error("Authentication required but no token found");
      }
      Object.assign(headers, {
        Authorization: `Bearer ${token}`,
        "x-noroff-api-key": socialKey,
      });
    }

    // Make the fetch request
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    // Handle non-2xx responses
    if (!response.ok) {
      // Try to parse error message from response
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response can't be parsed as JSON, use status text
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      // Throw error with message from API if available
      const errorMessage =
        errorData.errors?.[0]?.message ||
        errorData.message ||
        `API request failed: ${response.status}`;
      throw new Error(errorMessage);
    }

    // Parse and return successful response
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network errors or other exceptions
    console.error("API Request Error:", error);

    // Enhance the error with additional context
    error.endpoint = endpoint;
    error.params = params;

    // Handle authentication errors specifically
    if (
      error.message.includes("Authentication required") ||
      (error.message.includes("API request failed") &&
        error.message.includes("401"))
    ) {
      // Potentially redirect to login page or show auth error
      window.location.href = "../../";
    }

    // Re-throw the error for handling by the calling function
    throw error;
  }
}
