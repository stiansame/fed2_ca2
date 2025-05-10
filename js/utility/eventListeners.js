import { displayNotification } from "./displayUserNotifications.js";
import { createLikeButtonHandler } from "./handlers/likeHandlers.js";

/**
 * Attaches event listeners to the post card's interactive buttons.
 *
 * @param {HTMLElement} card - The root element of the post card.
 * @param {string} postId - The ID of the post.
 * @param {string} authorName - The name of the post author.
 */
export function addPostEventListeners(card, postId, authorName) {
  const likeBtn = card.querySelector("#postLikeBtn");
  if (likeBtn) {
    // Use the new handler that works with server-side data
    likeBtn.addEventListener("click", createLikeButtonHandler(card, postId));
  }

  const commentBtn = card.querySelector("#postCommentBtn");
  if (commentBtn) {
    commentBtn.addEventListener("click", () => {
      displayNotification("Comment mode activated", "info");
    });
  }

  const followBtn = card.querySelector("#followPosterBtn");
  if (followBtn) {
    followBtn.addEventListener("click", () => {
      displayNotification(`You are now following ${authorName}`, "success");
    });
  }

  const editBtn = card.querySelector("#editPostBtn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      displayNotification("Edit mode activated", "info");
    });
  }
}

/**
 * Adds event listeners to comment action buttons
 * @param {HTMLElement} container - Container with comment elements
 */
export function addCommentEventListeners(container) {
  // Like buttons
  container.querySelectorAll(".like-comment-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const commentId = e.currentTarget.dataset.commentId;
      const countSpan = e.currentTarget.querySelector("span");
      let count = parseInt(countSpan.textContent);

      // Update count (would normally be done via API)
      countSpan.textContent = count + 1;

      displayNotification("You liked this comment", "success");
    });
  });

  // Reply buttons
  container.querySelectorAll(".reply-comment-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const commentId = e.currentTarget.dataset.commentId;
      displayNotification("Reply mode activated", "info");
      // Would normally create a reply form
    });
  });

  // Edit buttons
  container.querySelectorAll(".edit-comment-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const commentId = e.currentTarget.dataset.commentId;
      displayNotification("Edit mode activated", "info");
      // Would normally transform the comment into an editable form
    });
  });

  // Delete buttons
  container.querySelectorAll(".delete-comment-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const commentId = e.currentTarget.dataset.commentId;
      if (confirm("Are you sure you want to delete this comment?")) {
        // Would normally call API to delete
        displayNotification("Comment deleted", "warning");
        // Remove the comment element
        const commentEl = btn.closest(`[data-comment-id="${commentId}"]`);
        commentEl.remove();
      }
    });
  });
}
