import { formatTimeAgo } from "../utility/dateFormatter.js";
import { checkOwnership } from "../user/userChecks.js";

/**
 * Creates a comment element
 * @param {Object} comment - Comment data
 * @param {Object} currentUser - Current user data
 * @returns {HTMLElement} - Comment element
 */
export function createCommentElement(comment, currentUser) {
  const div = document.createElement("div");
  div.className = "p-4";
  div.dataset.commentId = comment.id;
  div.dataset.postId = comment.postId;

  div.innerHTML = `
    <div class="flex items-start space-x-3">
      <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img src="${
          comment.author?.avatar?.url
        }" class="h-full w-full rounded-full object-cover" />
      </div>
      <div class="flex-grow">
        <h4 class="font-medium">${comment.author?.name || "Unknown"}</h4>
        <span class="text-xs text-gray-500">${formatTimeAgo(
          comment.created
        )}</span>
        <p class="text-gray-800 mt-2">${comment.body}</p>
        <div class="mt-2 flex items-center justify-between w-full px-4">
          <button class="reply-comment-btn text-xs text-gray-600 hover:text-blue-700" data-comment-id="${
            comment.id
          }" data-post-id="${comment.postId}">
            <i data-feather="message-square" class="h-3 w-3 inline"></i> Reply
          </button>
          <button class="delete-comment-btn text-xs text-gray-600 hover:text-red-700 hidden" data-comment-id="${
            comment.id
          }"
          data-post-id="${comment.postId}">
            <i data-feather="trash-2" class="h-3 w-3 inline"></i> Delete
          </button>
        </div>
      </div>
    </div>
  `;

  // Show/hide buttons based on ownership
  const deleteBtn = div.querySelector(".delete-comment-btn");
  checkOwnership("comment", comment, deleteBtn);

  return div;
}

/**
 * Creates a reply element
 * @param {Object} reply - Reply data
 * @param {Object} currentUser - Current user data
 * @returns {HTMLElement} - Reply element
 */
export function createReplyElement(reply, currentUser) {
  const div = document.createElement("div");
  div.className = "pt-2";
  div.dataset.commentId = reply.id;

  div.innerHTML = `
    <div class="flex items-start space-x-3">
      <div class="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img src="${
          reply.author?.avatar?.url
        }" class="h-full w-full rounded-full object-cover" />
      </div>
      <div class="w-full px-4">
        <h5 class="font-medium text-sm">${reply.author?.name || "Unknown"}</h5>
        <span class="text-xs text-gray-500">${formatTimeAgo(
          reply.created
        )}</span>
        <p class="text-gray-800 text-sm mt-1">${reply.body}</p>
        <div class="mt-2 flex justify-end w-full px-4">
          <button class="delete-comment-btn text-xs text-gray-600 hover:text-red-700 hidden" data-comment-id="${
            reply.id
          }"
          data-post-id="${reply.postId}">
            <i data-feather="trash-2" class="h-3 w-3 inline"></i> Delete
          </button>
        </div>
      </div>
    </div>
  `;

  // Show/hide buttons based on ownership
  const deleteBtn = div.querySelector(".delete-comment-btn");
  checkOwnership("reply", reply, deleteBtn);

  return div;
}
