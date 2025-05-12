import { getFromLocalStorage } from "../user/localStorage.js";

// Fetch current user
export async function fetchCurrentUser() {
  try {
    const loggedInUser = await getFromLocalStorage("profile");
    return loggedInUser;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}

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
