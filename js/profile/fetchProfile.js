import { apiGet } from "../api/getAPI.js";
import { PROFILES } from "../api/apiEndpoints.js";
import { getFromLocalStorage } from "../user/localStorage.js";
import { createModal } from "../utility/createModal.js";
import { renderProfileModal } from "./renderProfileModal.js";

// Get the logged-in user data
const loggedInUser = getFromLocalStorage("profile");
const postsContainer = document.getElementById("postsContainer");

// Elements to update with profile data
const profileImage = document.querySelector("main img");
const profileName = document.querySelector("main h1");
const followButton = document.querySelector(
  "main button.px-6.py-2.rounded-full"
);
const editButton = document.querySelector("button[aria-label='Edit profile']");
const statsContainers = document.querySelectorAll(
  "main .flex.justify-center .text-center"
);

/**
 * Fetch single profile data from the API
 */
async function fetchSingleProfile() {
  try {
    // Check if we have a logged-in user
    if (!loggedInUser || !loggedInUser.name) {
      console.error("No user logged in");
      renderErrorState();
      return;
    }

    console.log(`Fetching profile for: ${loggedInUser.name}`);

    const response = await apiGet(`${PROFILES}/${loggedInUser.name}`, {
      limit: 10,
      offset: 0,
      _following: true,
      _followers: true,
      _posts: true,
    });

    const profileData = response.data;
    console.log("Profile data:", profileData);

    // Render the profile with the fetched data
    renderProfile(profileData);
    document.getElementById("profileModal").innerHTML = renderProfileModal();

    // Show or hide edit button (only show for own profile)
    toggleEditButton(profileData.name === loggedInUser.name);

    // Render the posts
    if (profileData.posts && profileData.posts.length > 0) {
      renderPosts(profileData.posts);
    } else {
      renderNoPosts();
    }
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    renderErrorState();
  }
}

/**
 * Renders the profile information
 * @param {Object} profile - The profile data
 */
function renderProfile(profile) {
  // Update profile image if available
  if (profile.avatar) {
    profileImage.src = profile.avatar.url;
  }

  // Update profile name
  profileName.textContent = profile.name || "Unknown User";

  // Update stats
  if (statsContainers.length >= 3) {
    // Posts count
    statsContainers[0].querySelector(".block").textContent = profile.posts
      ? profile.posts.length
      : 0;

    // Followers count
    statsContainers[1].querySelector(".block").textContent =
      profile._count?.followers || 0;

    // Following count
    statsContainers[2].querySelector(".block").textContent =
      profile._count?.following || 0;
  }

  // Update follow button state if needed
  if (profile.isFollowing) {
    followButton.textContent = "Unfollow";
    followButton.classList.remove("bg-blue-700", "hover:bg-blue-900");
    followButton.classList.add("bg-gray-500", "hover:bg-gray-700");
  } else {
    followButton.textContent = "Follow";
  }

  // Add event listener to follow button
  followButton.addEventListener("click", () => toggleFollow(profile));
}

/**
 * Shows or hides the edit button based on whether the profile belongs to the logged-in user
 * @param {boolean} isOwnProfile - Whether this is the user's own profile
 */
function toggleEditButton(isOwnProfile) {
  if (editButton) {
    if (isOwnProfile) {
      editButton.classList.remove("hidden");
    } else {
      editButton.classList.add("hidden");
    }
  }
}

/**
 * Renders posts to the post container
 * @param {Array} posts - Array of post objects
 */
function renderPosts(posts) {
  postsContainer.innerHTML = ""; // Clear existing posts

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "bg-white rounded-lg shadow-md p-4 mb-4";

    // Create post content
    postElement.innerHTML = `
            <div class="flex items-start">
                <div class="flex-1">
                    <div class="flex items-center mb-2">
                        <h3 class="font-bold text-gray-800">${
                          post.title || "Untitled Post"
                        }</h3>
                    </div>
                    <p class="text-gray-700 mb-3">${
                      post.body || "No content"
                    }</p>
                    
                    ${
                      post.media
                        ? `
                        <div class="mb-3">
                            <img src="${post.media}" alt="Post media" class="w-full rounded-lg">
                        </div>
                    `
                        : ""
                    }
                    
                    <div class="flex items-center text-gray-500 text-sm">
                        <span class="flex items-center mr-4">
                            <i data-feather="heart" class="h-4 w-4 mr-1"></i>
                            ${post._count?.reactions || 0}
                        </span>
                        <span class="flex items-center">
                            <i data-feather="message-square" class="h-4 w-4 mr-1"></i>
                            ${post._count?.comments || 0}
                        </span>
                    </div>
                </div>
            </div>
        `;

    postsContainer.appendChild(postElement);
  });

  // Initialize Feather icons
  if (window.feather) {
    feather.replace();
  }
}

/**
 * Renders a message when there are no posts
 */
function renderNoPosts() {
  postsContainer.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
            <p class="text-gray-600">No posts yet.</p>
        </div>
    `;
}

/**
 * Renders an error state when profile fetching fails
 */
function renderErrorState() {
  // Update profile section with error
  profileName.textContent = "Error loading profile";

  // Hide edit button in error state
  if (editButton) {
    editButton.classList.add("hidden");
  }

  // Display error message in posts section
  postsContainer.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
            <p class="text-red-500">Failed to load profile data. Please try again later.</p>
        </div>
    `;
}

/**
 * Toggles following status for a profile
 * @param {Object} profile - The profile to follow/unfollow
 */
async function toggleFollow(profile) {
  // Implementation would go here (not part of the current code)
  console.log("Toggle follow for:", profile.name);
  // This would typically make an API call to follow/unfollow
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  fetchSingleProfile();

  // Initialize Feather icons
  if (window.feather) {
    feather.replace();
  }
});

// Export functions for testing/reuse
export { fetchSingleProfile, renderProfile, renderPosts };

createModal({
  openButtonId: "openProfileModalBtn",
  modalId: "profileModal",
  closeButtonId: "closeProfileModal",
});
