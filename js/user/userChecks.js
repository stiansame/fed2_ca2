import { getFromLocalStorage } from "../user/localStorage.js";

// Fetch current user
export async function fetchCurrentUser() {
  try {
    const loggedInUser = await getFromLocalStorage("profile");
    return loggedInUser;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
  }
}

// Check if current user is post owner
export function checkPostOwnership() {
  if (
    postData &&
    loggedInUser &&
    postData.author &&
    postData.author.name === loggedInUser.name
  ) {
    // document.getElementById("sidebarEditButton").classList.remove("hidden");
  }
}
