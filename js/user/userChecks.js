import { getFromLocalStorage } from "../user/localStorage.js";
import { displayNotification } from "../utility/displayUserNotifications.js";

// Fetch current user
export async function fetchCurrentUser() {
  try {
    const loggedInUser = await getFromLocalStorage("profile");

    if (!loggedInUser) {
      displayNotification("No user found. Please Login!", "error");
      return "undefined";
    } else {
      return loggedInUser;
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return "undefined";
  }
}

/**
 * Generalized function to check ownership for posts, profiles, comments, and replies.
 * Optionally shows/hides a button based on ownership.
 * @param {'post'|'profile'|'comment'|'reply'} type
 * @param {Object} data
 * @param {HTMLElement} [buttonElement] - Optional button to show/hide based on ownership
 * @returns {Promise<boolean>} - true if owner, false otherwise
 */
export async function checkOwnership(type, data, buttonElement) {
  const loggedInUser = await fetchCurrentUser();

  if (!loggedInUser) {
    console.error("No logged-in user found.");
    return false;
  }

  let isOwner = false;

  if (type === "post") {
    isOwner = data.author && data.author.name === loggedInUser.name;
  } else if (type === "profile") {
    isOwner = data.name === loggedInUser.name;
  } else if (type === "comment" || type === "reply") {
    isOwner = data.author && data.author.name === loggedInUser.name;
  } else {
    console.error(
      "Invalid type provided. Must be 'post', 'profile', 'comment', or 'reply'."
    );
    return false;
  }

  if (buttonElement) {
    if (isOwner) {
      buttonElement.classList.remove("hidden");
    } else {
      buttonElement.classList.add("hidden");
    }
  }

  return isOwner;
}

export async function checkLoginAndRoute() {
  const currentUser = await fetchCurrentUser();
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (currentUser && currentUser !== "undefined") {
    // User is logged in, just update menu
    if (loginBtn) loginBtn.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
  } else {
    // Not logged in, redirect to login (unless already there)
    if (!window.location.pathname.includes("login")) {
      window.location.href = "../login/index.html";
      return;
    }
    if (logoutBtn) logoutBtn.classList.add("hidden");
    if (loginBtn) loginBtn.classList.remove("hidden");
  }
}

//LOGOUT
export function logout() {
  if (confirm("Are you sure you want to logout?")) {
    // Remove profile and accessToken from localStorage
    localStorage.removeItem("profile");
    localStorage.removeItem("accessToken");
    window.location.reload();
  }
}
