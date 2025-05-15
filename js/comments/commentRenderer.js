import { addCommentEventListeners } from "../utility/eventListeners.js";
import { createCommentElement, createReplyElement } from "./commentHelpers.js";
import { createModal } from "../utility/createModal.js";
import { fetchPost, postComment } from "../posts/apiService.js";

/**
 * Renders comments in the provided container
 * @param {Array} comments - Array of comment objects
 * @param {Object} currentUser - Current user data
 * @param {HTMLElement} container - Container element for comments
 */
export function renderComments(comments, currentUser, container) {
  if (!container) {
    console.error("No container provided for comments");

    return;
  }

  container.innerHTML = "";

  if (!comments || comments.length === 0) {
    container.innerHTML = `
      <div class="p-4 text-center text-gray-500">
        No comments yet. Be the first to comment!
      </div>
    `;
    return;
  }

  // Group comments by parent
  const parentComments = comments.filter((comment) => !comment.replyToId);
  const replies = comments.filter((comment) => comment.replyToId);

  // Create a map of replies by parent id
  const repliesByParent = {};
  replies.forEach((reply) => {
    if (!repliesByParent[reply.replyToId]) {
      repliesByParent[reply.replyToId] = [];
    }
    repliesByParent[reply.replyToId].push(reply);
  });

  // Render parent comments with their replies
  parentComments.forEach((comment) => {
    const commentElement = createCommentElement(comment, currentUser);

    // Add replies if any
    if (repliesByParent[comment.id] && repliesByParent[comment.id].length > 0) {
      const repliesContainer = document.createElement("div");
      repliesContainer.className =
        "mt-3 pl-6 border-l-2 border-gray-100 space-y-3";

      repliesByParent[comment.id].forEach((reply) => {
        const replyElement = createReplyElement(reply, currentUser);
        repliesContainer.appendChild(replyElement);
      });

      commentElement.querySelector(".flex-grow").appendChild(repliesContainer);
    }

    container.appendChild(commentElement);
  });

  // Re-initialize Feather icons
  feather.replace();

  //Establish Post and comment ID's
  let currentPostId = null;
  let currentCommentId = null;

  //comment modal
  createModal({
    openButtonSelector: "#postCommentBtn",
    modalId: "commentModal",
    closeButtonId: "closeCommentModal",
    formId: "commentForm",

    onOpen: (btn, modal) => {
      currentPostId = btn.dataset.postId;
      console.log(currentPostId);
    },
    onSubmit: async () => {
      await postComment(
        currentPostId,
        null,
        document.querySelector("#commentContent").value
      );
      const updatedPost = await fetchPost(currentPostId);
      renderComments(updatedPost.comments, currentUser, commentsContainer);
    },
  });

  //reply modal
  createModal({
    openButtonSelector: ".reply-comment-btn",
    modalId: "replyModal",
    closeButtonId: "closeReplyModal",
    formId: "replyForm",
    onOpen: (btn, modal) => {
      currentPostId = btn.dataset.postId;
      currentCommentId = Number(btn.dataset.commentId);
      console.log(currentPostId, currentCommentId);
    },
    onSubmit: async () => {
      const replyValue = document.querySelector("#replyContent").value;
      console.log("Reply Value:", replyValue);

      await postComment(currentPostId, currentCommentId, replyValue);
      const updatedPost = await fetchPost(currentPostId);
      renderComments(updatedPost.comments, currentUser, commentsContainer);
    },
  });

  // Add event listeners to comment action buttons
  addCommentEventListeners(container);
}
