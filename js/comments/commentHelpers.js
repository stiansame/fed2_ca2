import { formatTimeAgo } from "../utility/dateFormatter.js";
import { checkOwnership } from "../user/userChecks.js";

export function createCommentElement(comment, currentUser) {
  const div = document.createElement("div");
  div.className = "p-4";
  div.dataset.commentId = comment.id;
  div.dataset.postId = comment.postId;

  div.innerHTML = `
    <div class="flex items-start space-x-3">
      <a href="/profile/index.html?username=${encodeURIComponent(
        comment.author?.name || ""
      )}" class="flex items-center gap-2 group">
        <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img src="${
            comment.author?.avatar?.url || "/default-avatar.png"
          }" class="h-full w-full rounded-full object-cover" />
        </div>
        <span class="font-medium group-hover:underline">${
          comment.author?.name || "Unknown"
        }</span>
      </a>
      <div class="flex-grow">
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
          }" data-post-id="${comment.postId}">
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

export function createReplyElement(reply, currentUser) {
  const div = document.createElement("div");
  div.className = "pt-2 bg-gray-50 p-2 rounded-md";
  div.dataset.commentId = reply.id;

  div.innerHTML = `
    <div class="flex items-start space-x-3">
      <a href="/profile/index.html?username=${encodeURIComponent(
        reply.author?.name || ""
      )}" class="flex items-center gap-2 group">
        <div class="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img src="${
            reply.author?.avatar?.url || "/default-avatar.png"
          }" class="h-full w-full rounded-full object-cover" />
        </div>
        <span class="font-medium text-sm group-hover:underline">${
          reply.author?.name || "Unknown"
        }</span>
      </a>
      <div class="w-full px-4">
        <span class="text-xs text-gray-500">${formatTimeAgo(
          reply.created
        )}</span>
        <p class="text-gray-800 text-sm mt-1">${reply.body}</p>
        <div class="mt-2 flex justify-end w-full px-4">
          <button class="delete-comment-btn text-xs text-gray-600 hover:text-red-700 hidden" data-comment-id="${
            reply.id
          }" data-post-id="${reply.postId}">
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
