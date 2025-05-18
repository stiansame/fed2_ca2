import { apiGet } from "../api/getAPI.js";
import { PROFILES } from "../api/apiEndpoints.js";
import { getFromLocalStorage } from "../user/localStorage.js";
import { createModal } from "../utility/createModal.js";
import { profileUpdater } from "./updateProfile.js";
import { renderPosts } from "../posts/renderAllposts.js";
import { checkOwnership } from "../user/userChecks.js";
import { fetchPostsByProfile } from "../posts/apiService.js";
import { setupFollowButton } from "../utility/handlers/followProfile.js";

// Get the logged-in user data
const loggedInUser = getFromLocalStorage("profile") || {};
const { name: loggedInUserName } = loggedInUser;

const postsContainer = document.querySelector(".postsContainer");

// Elements to update with profile data
const profileImage = document.getElementById("profileAvatarImg");
const currentAvatar = document.getElementById("currentAvatar");
const bannerUrl = document.getElementById("bannerUrl");
const avatarUrl = document.getElementById("avatarUrl");
const bannerImage = document.getElementById("profileBannerImg");
const profileName = document.querySelector("main h1");
const userNameInput = document.getElementById("name");
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
    const urlParams = new URLSearchParams(window.location.search);
    const profileNameFromUrl = urlParams.get("username");

    // Prefer URL param, fallback to localStorage
    const userName = profileNameFromUrl || loggedInUserName;

    if (!userName) {
      console.error("No username found in URL or localStorage");
      renderErrorState();
      return;
    }

    // Destructure data from response
    const { data: profileData } = await apiGet(`${PROFILES}/${userName}`, {
      _following: true,
      _followers: true,
      _posts: true,
    });

    // Fetch posts by profile
    const profilePosts = await fetchPostsByProfile(userName);

    // Update page title
    document.title = `FEDS profile | ${profileData.name}`;

    // Render the profile
    renderProfile(profileData);

    // Setup follow button
    const { followers } = profileData;
    setupFollowButton({
      btnId: "followProfileBtn",
      profileName: profileData.name,
      userName: loggedInUserName,
      followersArray: followers,
      onFollowChange: fetchSingleProfile,
    });

    // Check ownership and show edit button if applicable
    const editBtn = document.getElementById("editProfileBtn");
    await checkOwnership("profile", profileData, editBtn);

    // Setup modal and profile updater
    createModal({
      openButtonSelector: "#editProfileBtn",
      modalId: "profileModal",
      closeButtonId: "closeProfileModal",
    });

    profileUpdater();

    // Render posts
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
 * @param {Object} profile
 */
function renderProfile(profile) {
  // Destructure needed fields from profile
  const {
    avatar,
    banner,
    name = "Unknown User",
    email = "",
    bio = "",
    posts = [],
    _count = {},
    isFollowing = false,
  } = profile;

  // Destructure _count
  const { followers = 0, following = 0 } = _count;

  // Avatar
  if (avatar?.url) {
    profileImage.src = avatar.url;
    currentAvatar.src = avatar.url;
    avatarUrl.value = avatar.url;
  }

  // Banner
  if (banner?.url) {
    bannerImage.src = banner.url;
    bannerUrl.value = banner.url;
  }

  // Name, email, bio
  profileName.textContent = name;
  userNameInput.value = name;
  userMail.value = email;
  profileBio.textContent = bio;
  userBio.value = bio;

  // Stats
  if (statsContainers.length >= 3) {
    statsContainers[0].querySelector(".block").textContent = posts.length;
    statsContainers[1].querySelector(".block").textContent = followers;
    statsContainers[2].querySelector(".block").textContent = following;
  }

  // Follow button state
  if (isFollowing) {
    followButton.textContent = "Following";
    followButton.classList.remove("bg-blue-700", "hover:bg-blue-900");
    followButton.classList.add("bg-gray-500", "hover:bg-gray-700");
  } else {
    followButton.querySelector("span").textContent = "Follow";
  }

  // Add follow toggle event
  followButton.addEventListener("click", () => toggleFollow(profile));
}

/**
 * Shows or hides the edit button based on ownership
 * @param {boolean} isOwnProfile
 */
function toggleEditButton(isOwnProfile) {
  if (editButton) {
    editButton.classList.toggle("hidden", !isOwnProfile);
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
  profileName.textContent =
    "Error loading profile - make sure you are logged in!";

  if (editButton) {
    editButton.classList.add("hidden");
  }

  postsContainer.innerHTML = `
    <div class="bg-white rounded-lg shadow-md p-6 text-center">
      <p class="text-red-500">Failed to load profile data. Make sure you are logged in.</p>
    </div>
  `;

  setTimeout(() => {
    window.location.href = "../../";
  }, 2000);
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
