import {
  fetchPost,
  fetchProfileData,
  fetchComments,
  updatePost,
  postComment,
  fetchPostsByProfile,
} from "./apiService.js";
import { createPostCard } from "./postRenderer.js";
import { renderComments } from "../comments/commentRenderer.js";
import { getUrlParam } from "../utility/urlHandler.js";
import { displayNotification } from "../utility/displayUserNotifications.js";
import {
  addPostEventListeners,
  modalSubmitEventListener,
} from "../utility/eventListeners.js";
import { isReacted } from "../utility/handlers/postHandlers.js";
import { createModal } from "../utility/createModal.js";
import { checkOwnership } from "../user/userChecks.js";
import { refreshAll } from "../utility/handlers/refreshAll.js";
import { getFromLocalStorage } from "../user/localStorage.js";
import { setupFollowButton } from "../utility/handlers/followProfile.js";
import { updateCount } from "../utility/textCounter.js";

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

    // Fetch and display latest 5 posts from author excluding current
    try {
      const authorPosts = await fetchPostsByProfile(postProfile);
      // Exclude the current post
      const latestPosts = authorPosts
        .filter((p) => String(p.id) !== String(postId))
        .slice(0, 5);
      const list = document.getElementById("authorLatestPosts");
      if (list) {
        list.innerHTML = "";
        if (latestPosts.length === 0) {
          list.innerHTML = "<li class='text-gray-500'>No other posts.</li>";
        } else {
          latestPosts.forEach((post) => {
            const li = document.createElement("li");
            li.className = "border-b last:border-b-0 pb-2";
            li.innerHTML = `
          <a href="single.html?id=${
            post.id
          }" class="text-blue-700 hover:text-blue-900 block text-sm">
            ${post.title ? post.title : "(Untitled post)"}
          </a>
        `;
            list.appendChild(li);
          });
        }
      }
    } catch (err) {
      const list = document.getElementById("authorLatestPosts");
      if (list)
        list.innerHTML = "<li class='text-gray-500'>Could not load posts.</li>";
    }

    // Get profile data
    const profileData = await fetchProfileData(postProfile);
    followerCount = profileData._count?.followers || 0;

    // Render post
    const container = document.getElementById("singlePostDiv");
    container.innerHTML = "";
    const card = createPostCard(postData, followerCount);
    container.appendChild(card);

    // Check if the current user owns the post and display edit button
    const editBtn = document.getElementById("editPostBtn");
    await checkOwnership("post", postData, editBtn);

    //Check and alter follow state
    const userName = getFromLocalStorage("profile")?.name;
    const followersArray = profileData.followers;

    setupFollowButton({
      btnId: "followBtn",
      profileName: profileData.name,
      userName,
      followersArray,
      onFollowChange: () => refreshAll(postId, userName),
    });

    // Modals

    //Call Modal for editing Post
    const modal = document.getElementById("editModal");
    createModal({
      openButtonSelector: "#editPostBtn",
      modalId: "editModal",
      closeButtonId: "closeEditModal",
      formId: "editPostForm",
      onOpen: () => {
        updateCount("editContent", "editCharCount");
      },
      onSubmit: () => updatePost(postId),
    });

    //Call comment modal
    let currentPostId = null;
    let currentCommentId = null;

    createModal({
      openButtonSelector: "#postCommentBtn",
      modalId: "commentModal",
      closeButtonId: "closeCommentModal",
      formId: "commentForm",

      onOpen: (btn, modal) => {
        currentPostId = btn.dataset.postId;
      },
      onSubmit: async () => {
        await postComment(
          currentPostId,
          null,
          document.querySelector("#commentContent").value
        );
        const updatedPost = await fetchPost(currentPostId);
        await refreshAll(currentPostId, currentUser, followerCount);
      },
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

    //reply modal
    createModal({
      openButtonSelector: ".reply-comment-btn",
      modalId: "replyModal",
      closeButtonId: "closeReplyModal",
      formId: "replyForm",
      onOpen: (btn, modal) => {
        currentPostId = btn.dataset.postId;
        currentCommentId = Number(btn.dataset.commentId);
      },
      onSubmit: async () => {
        const replyValue = document.querySelector("#replyContent").value;

        await postComment(currentPostId, currentCommentId, replyValue);
        const updatedPost = await fetchPost(currentPostId);
        await refreshAll(currentPostId, currentUser, followerCount);
      },
    });

    // One final feather.replace() for any icons in comments
    feather.replace();
  } catch (error) {
    console.error("Error initializing page:", error);
    displayNotification("Failed to load content", "error");
  }
}

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", initPage);
document.querySelectorAll(".modal").forEach(modalSubmitEventListener);
