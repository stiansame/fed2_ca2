import { API_BASE } from "./apiEndpoints.js";
import { getFromLocalStorage } from "../user/localStorage.js";
import { socialKey } from "./apiKeys.js";

export async function apiPut(endpoint, body) {
  try {
    const url = new URL(API_BASE + endpoint);

    const token = getFromLocalStorage("accessToken");
    if (!token) {
      throw new Error("Authentication required but no token found");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-noroff-api-key": socialKey,
    };

    // Build the fetch options
    const options = {
      method: "PUT",
      headers,
    };

    // Only add body if explicitly provided AND not undefined/null
    if (body !== undefined && body !== null) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    console.log(response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message =
        errorData?.errors?.[0]?.message ||
        errorData?.message ||
        `API request failed: ${response.status}`;
      if (response.status === 401) {
        window.location.href = "../../";
      }
      throw new Error(message);
    }

    // Some endpoints may return no body
    try {
      return await response.json();
    } catch {
      return null;
    }
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}
