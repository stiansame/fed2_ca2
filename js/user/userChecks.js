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
/* 
// function to check ownership
export async function checkOwnership(type, data) {
  const loggedInUser = await fetchCurrentUser();

  if (!loggedInUser) {
    console.error("No logged-in user found.");
    return;
  }

  if (type === "post") {
    if (data.author && data.author.name === loggedInUser.name) {
      // For post, show the edit button
      document.getElementById("editPostBtn").classList.remove("hidden");
    } else {
      document.getElementById("editPostBtn").classList.add("hidden");
    }
  } else if (type === "profile") {
    if (data.name === loggedInUser.name) {
      // For profile, show the edit button
      document.getElementById("openProfileModalBtn").classList.remove("hidden");
    } else {
      document.getElementById("openProfileModalBtn").classList.add("hidden");
    }
  } else {
    console.error("Invalid type provided. Must be 'post' or 'profile'.");
  }
}
 */
