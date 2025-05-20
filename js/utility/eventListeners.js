import { displayNotification } from "./displayUserNotifications.js";
import { createLikeButtonHandler } from "./handlers/likeHandlers.js";
import { deleteComment } from "../posts/apiService.js";
import { refreshAll } from "../utility/handlers/refreshAll.js";

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

  const editBtn = card.querySelector("#editPostBtn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      displayNotification("Edit mode activated", "info");
    });
  }
}

export function modalSubmitEventListener(modal) {
  const updatePostBtn = modal.querySelector("#updatePostBtn");
  if (updatePostBtn) {
    updatePostBtn.addEventListener("click", () => {
      displayNotification("Post updated", "success");
    });
  }

  const commentReplyBtn = modal.querySelector("#comment-reply-btn");
  if (commentReplyBtn) {
    commentReplyBtn.addEventListener("click", () => {
      displayNotification("You replied to this comment", "success");
    });
  }

  const commentBtn = modal.querySelector("#comment-btn");
  if (commentBtn) {
    commentBtn.addEventListener("click", () => {
      displayNotification("You commented this post", "success");
    });
  }
}

/**
 * Adds event listeners to comment action buttons
 * @param {HTMLElement} container - Container with comment elements
 */
export function addCommentEventListeners(container) {
  // Reply buttons
  commentsContainer.querySelectorAll(".reply-comment-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      displayNotification("Reply mode activated", "info");
    });
  });

  // Delete buttons
  container.querySelectorAll(".delete-comment-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const postId = e.currentTarget.dataset.postId;
      const commentId = e.currentTarget.dataset.commentId;
      if (confirm("Are you sure you want to delete this comment?")) {
        //Call delete function
        deleteComment(postId, commentId);

        //Display Info
        displayNotification("Comment deleted", "warning");

        // reload Post
        refreshAll(postId, commentId);
      }
    });
  });
}
