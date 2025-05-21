import { API_BASE } from "./apiEndpoints.js";
import { getFromLocalStorage } from "../user/localStorage.js";
import { socialKey } from "./apiKeys.js";

export async function apiGet(endpoint, params = {}) {
  try {
    //construct full URL
    const url = new URL(API_BASE + endpoint);

    //Add query parameters
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    //check for/get accessToken from LocalStorage
    const token = getFromLocalStorage("accessToken");
    if (!token) {
      throw new Error("Authentication required but no token found");
    }

    //Define Headers
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-noroff-api-key": socialKey,
    };

    //make fetch request
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    //basic error handling
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

    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}
