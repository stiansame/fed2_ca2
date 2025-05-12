import { apiGet } from "../api/getAPI.js";
import { PROFILES } from "../api/apiEndpoints.js";
import { getFromLocalStorage } from "../user/localStorage.js";
import { createModal } from "../utility/createModal.js";
import { renderProfileModal } from "./renderProfileModal.js";
import { profileUpdater } from "./updateProfile.js";
import { truncateTextAtWordBoundary } from "../utility/textTruncater.js";

// Get the logged-in user data
const loggedInUser = getFromLocalStorage("profile");
const postsContainer = document.getElementById("postsContainer");

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
    // Check if we have a logged-in user
    if (!loggedInUser || !loggedInUser.name) {
      console.error("No user logged in");
      renderErrorState();
      return;
    }

    console.log(`Fetching profile for: ${loggedInUser.name}`);

    const response = await apiGet(`${PROFILES}/${loggedInUser.name}`, {
      _following: true,
      _followers: true,
      _posts: true,
    });

    const profileData = response.data;
    console.log(profileData);

    // Render the profile with the fetched data
    renderProfile(profileData);
    createModal({
      openButtonId: "openProfileModalBtn",
      modalId: "profileModal",
      closeButtonId: "closeProfileModal",
    });
    profileUpdater();

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

/**
 * Renders posts to the post container
 * @param {Array} posts - Array of post objects
 */
function renderPosts(posts) {
  postsContainer.innerHTML = ""; // Clear existing posts

  // Create a grid container with responsive columns
  postsContainer.className =
    "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className =
      "bg-white p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-103 hover:rotate-1";

    // Create post content
    postElement.innerHTML = `
      <div class="flex flex-col space-y-4 h-full">
          <!-- Post Title -->
          <h3 class="text-xl font-bold text-gray-800">${post.title}</h3>
          
          <!-- Post Image -->
          <img src="${post.media.url}" alt="${
      post.media.alt
    }" class="rounded-lg w-full object-cover">
          
          <!-- Post Content -->
          <p class="text-gray-700 whitespace-pre-line flex-1">${
            truncateTextAtWordBoundary(post.body) || "No content!"
          }</p>
          
	<!-- Post Tags -->
<div class="flex flex-wrap gap-2">
  ${
    post.tags
      ?.map(
        (tag) => `
    <a href="/tags/${encodeURIComponent(tag)}" 
       class="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-gray-300 transition-colors">
      #${tag}
    </a>
  `
      )
      .join("") || ""
  }
</div>
          
          <!-- Post Interactions -->
          <div class="flex justify-between items-center mt-auto">
                      <div class="flex gap-4">
                          <button class="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                              <i data-feather="heart" class="h-4 w-4"></i>
                              ${post._counts?.reactions || 0}
                          </button>
                          <button class="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                              <i data-feather="message-circle" class="h-4 w-4"></i>
                              ${post._count?.comments || 0}
                          </button>
                      </div>
                      <div class="flex gap-2">
                          <button class="text-gray-600 hover:text-gray-800">
                              <i data-feather="share-2" class="h-4 w-4"></i>
                          </button>
                          <button class="text-gray-600 hover:text-gray-800">
                              <i data-feather="bookmark" class="h-4 w-4"></i>
                          </button>
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
