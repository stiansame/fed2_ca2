import { getFromLocalStorage } from "../user/localStorage.js";
import { displayNotification } from "../utility/displayUserNotifications.js";

/**
 * Asynchronously fetches the currently logged-in user's profile from local storage.
 * Displays an error notification if no user is found or if fetching fails.
 *
 * @async
 * @function fetchCurrentUser
 * @returns {Promise<Object|string>} Resolves to the user profile object if found,
 * or the string "undefined" if not found or on error.
 */
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

  // Use destructuring for relevant objects
  const { name: loggedInUserName } = loggedInUser || {};
  let isOwner = false;

  if (type === "post") {
    const { author = {} } = data || {};
    isOwner = author.name === loggedInUserName;
  } else if (type === "profile") {
    const { name } = data || {};
    isOwner = name === loggedInUserName;
  } else if (type === "comment" || type === "reply") {
    const { author = {} } = data || {};
    isOwner = author.name === loggedInUserName;
  } else {
    console.error(
      "Invalid type provided. Must be 'post', 'profile', 'comment', or 'reply'."
    );
    return false;
  }

  if (buttonElement) {
    buttonElement.classList.toggle("hidden", !isOwner);
  }

  return isOwner;
}

/**
 * Checks if a user is logged in and updates the visibility of login/logout buttons.
 * If the user is not logged in, redirects them to the login page unless they are
 * already on the login or register page.
 *
 * - Hides the login button and shows the logout button if the user is logged in.
 * - Shows the login button and hides the logout button if the user is not logged in.
 * - Redirects to the login page if not on login or register page.
 *
 * @async
 * @function checkLoginAndRoute
 * @returns {Promise<void>} Resolves when the function completes.
 */
export async function checkLoginAndRoute() {
  const currentUser = await fetchCurrentUser();
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (currentUser && currentUser !== "undefined") {
    // User is logged in, just update menu
    loginBtn?.classList.add("hidden");
    logoutBtn?.classList.remove("hidden");
  } else {
    // Not logged in
    const { pathname } = window.location;
    const isOnLoginPage = pathname.includes("login");
    const isOnRegisterPage = pathname.endsWith("/register/");

    if (!isOnLoginPage && !isOnRegisterPage) {
      window.location.href = "../login/index.html";
      return;
    }
    logoutBtn?.classList.add("hidden");
    loginBtn?.classList.remove("hidden");
  }
}

/**
 * Logs out the current user after confirmation.
 * Removes user profile and access token from local storage and reloads the page.
 *
 * @function logout
 * @returns {void}
 */
export function logout() {
  if (confirm("Are you sure you want to logout?")) {
    // Remove profile and accessToken from localStorage
    localStorage.removeItem("profile");
    localStorage.removeItem("accessToken");
    window.location.reload();
  }
}
