import { apiGet } from "../api/getAPI.js";
import { PROFILES } from "../api/apiEndpoints.js";
import { getFromLocalStorage } from "../user/localStorage.js";
import { createModal } from "../utility/createModal.js";
import { profileUpdater } from "./updateProfile.js";
import { renderPosts } from "../posts/renderAllposts.js";
import { checkOwnership } from "../user/userChecks.js";
import { fetchPostsByProfile } from "../posts/apiService.js";

// Get the logged-in user data
const loggedInUser = getFromLocalStorage("profile");
const postsContainer = document.querySelector(".postsContainer");

// Elements to update with profile data
const profileImage = document.getElementById("profileAvatarImg");
const currentAvatar = document.getElementById("currentAvatar");
const bannerUrl = document.getElementById("bannerUrl");
const avatarUrl = document.getElementById("avatarUrl");
const bannerImage = document.getElementById("profileBannerImg");
const profileName = document.querySelector("main h1");
const userName = document.getElementById("name");
const userMail = document.getElementById("email");
const userBio = document.getElementById("bio");
const profileBio = document.getElementById("profileBio");

const followButton = document.getElementById("followProfileBtn");
const editButton = document.querySelector("button[aria-label='Edit profile']");
const statsContainers = document.querySelectorAll(
  "main .flex.justify-center .text-center"
);

/**
 * Fetch single profile data from the API
 */
async function fetchSingleProfile() {
  try {
    // Get the username from the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const profileNameFromUrl = urlParams.get("username");

    // If the profileNameFromUrl is null, fallback to logged-in user's name from localStorage
    const userName = profileNameFromUrl || (loggedInUser && loggedInUser.name);

    if (!userName) {
      console.error("No username found in URL or localStorage");
      renderErrorState();
      return;
    }

    console.log(`Fetching profile for: ${userName}`);

    const response = await apiGet(`${PROFILES}/${userName}`, {
      _following: true,
      _followers: true,
      _posts: true,
    });

    const profileData = response.data;

    //Get all posts by profile
    const profilePosts = await fetchPostsByProfile(userName);

    // Update page title with the fetched profile's name
    document.title = `FEDS profile | ${profileData.name}`;

    // Render the profile with the fetched data
    renderProfile(profileData);

    // Check if the current user owns the profile and display edit button
    const editBtn = document.getElementById("editProfileBtn");
    await checkOwnership("profile", profileData, editBtn);

    //call edit Profile Modal
    createModal({
      openButtonSelector: "#editProfileBtn",
      modalId: "profileModal",
      closeButtonId: "closeProfileModal",
    });

    profileUpdater();

    // Render the posts associated with the profile
    if (profilePosts && profilePosts.length > 0) {
      renderPosts(profilePosts, undefined, {
        containerLayout: "grid",
        cardLayout: "stacked",
      });
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
    currentAvatar.src = profile.avatar.url;
    avatarUrl.value = profile.avatar.url;
  }

  //update profile banner image if available
  if (profile.banner) {
    bannerImage.src = profile.banner.url;
    bannerUrl.value = profile.banner.url;
  }

  // Update profile name and email
  profileName.textContent = profile.name || "Unknown User";
  userName.value = profile.name;
  userMail.value = profile.email;

  //Update profile Bio
  profileBio.textContent = profile.bio;
  userBio.value = profile.bio;

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
    followButton.textContent = "Following";
    followButton.classList.remove("bg-blue-700", "hover:bg-blue-900");
    followButton.classList.add("bg-gray-500", "hover:bg-gray-700");
  } else {
    followButton.querySelector("span").textContent = "Follow";
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
  profileName.textContent =
    "Error loading profile - make sure you are logged in!";

  // Hide edit button in error state
  if (editButton) {
    editButton.classList.add("hidden");
  }

  // Display error message in posts section
  postsContainer.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
            <p class="text-red-500">Failed to load profile data. Make sure you are logged in.</p>
        </div>
    `;

  // return user to login page
  setTimeout(() => {
    window.location.href = "../../";
  }, 2000);
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
