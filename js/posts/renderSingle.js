import {
  fetchPost,
  fetchProfileData,
  fetchComments,
  updatePost,
} from "./apiService.js";
import { createPostCard } from "./postRenderer.js";
import { renderComments } from "../comments/commentRenderer.js";
import { getUrlParam } from "../utility/urlHandler.js";
import { displayNotification } from "../utility/displayUserNotifications.js";
import { addPostEventListeners } from "../utility/eventListeners.js";
import { isReacted } from "../utility/handlers/postHandlers.js";
import { createModal } from "../utility/createModal.js";
import { checkOwnership } from "../user/userChecks.js";

// Global state
let postData = null;
let comments = [];
let currentUser = null;
let followerCount = null;

/**
 * Initializes the page
 */
async function initPage() {
  // Initialize Feather icons
  feather.replace();

  // Get post ID from URL
  const postId = getUrlParam("id");

  if (!postId) {
    displayNotification("Post ID not found in URL", "error");
    setTimeout(() => {
      window.location.href = "../feed/";
    }, 2000);
    return;
  }

  try {
    // Fetch post data
    postData = await fetchPost(postId);
    const postProfile = postData.author.name;

    // Get profile data
    const profileData = await fetchProfileData(postProfile);
    followerCount = profileData._count?.followers || 0;

    // Render post
    const container = document.getElementById("singlePostDiv");
    container.innerHTML = "";
    const card = createPostCard(postData, followerCount);
    container.appendChild(card);

    // Check if the current user owns the post
    await checkOwnership("post", postData);

    // Modals

    //Call Modal for editing Post
    createModal({
      openButtonSelector: "#editPostBtn",
      modalId: "editModal",
      closeButtonId: "closeEditModal",
      formId: "editPostForm",
      onSubmit: () => updatePost(postId),
    });

    // Re-initialize Feather icons after adding the card to the DOM
    feather.replace();

    // Now set up event listeners and reaction state after icons are processed
    addPostEventListeners(card, postData.id, postData.author.name);
    isReacted(card, postData);

    // Fetch and render comments
    comments = await fetchComments(postId);
    const commentsContainer = document.getElementById("commentsContainer");
    renderComments(comments, currentUser, commentsContainer);

    // One final feather.replace() for any icons in comments
    feather.replace();
  } catch (error) {
    console.error("Error initializing page:", error);
    displayNotification("Failed to load content", "error");
  }
}

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", initPage);

// Export functions that might be needed elsewhere
export { initPage };
