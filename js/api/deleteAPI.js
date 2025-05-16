import { API_BASE } from "./apiEndpoints.js";
import { getFromLocalStorage } from "../user/localStorage.js";
import { socialKey } from "./apiKeys.js";

export async function apiDelete(endpoint) {
  try {
    //construct full URL
    const url = new URL(API_BASE + endpoint);

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

    //make delete request
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });
    console.log(response);
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}
