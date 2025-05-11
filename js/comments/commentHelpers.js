import { formatTimeAgo } from "../utility/dateFormatter.js";

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

  div.innerHTML = `
    <div class="flex items-start space-x-3">
      <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img src="${
          comment.author?.avatar?.url
        }"class="h-full w-full rounded-full object-cover" />
      </div>
      <div class="flex-grow">
        <h4 class="font-medium">${comment.author?.name || "Unknown"}</h4>
        <span class="text-xs text-gray-500">${formatTimeAgo(
          comment.created
        )}</span>
        <p class="text-gray-800 mt-2">${comment.body}</p>
        
        <div class="mt-2 flex items-center space-x-4">
          <button class="like-comment-btn text-xs text-gray-600 hover:text-blue-700" data-comment-id="${
            comment.id
          }">
            <i data-feather="heart" class="h-3 w-3 inline"></i> 
            <span>${comment._count?.reactions || 0}</span> Likes
          </button>
          <button class="reply-comment-btn text-xs text-gray-600 hover:text-blue-700" data-comment-id="${
            comment.id
          }">
            <i data-feather="message-square" class="h-3 w-3 inline"></i> Reply
          </button>
          ${
            currentUser && comment.author?.name === currentUser.name
              ? `
            <button class="edit-comment-btn text-xs text-gray-600 hover:text-blue-700" data-comment-id="${comment.id}">
              <i data-feather="edit" class="h-3 w-3 inline"></i> Edit
            </button>
            <button class="delete-comment-btn text-xs text-gray-600 hover:text-red-700" data-comment-id="${comment.id}">
              <i data-feather="trash-2" class="h-3 w-3 inline"></i> Delete
            </button>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;

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
      <div class="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <i data-feather="user" class="h-4 w-4 text-blue-700"></i>
      </div>
      <div>
        <h5 class="font-medium text-sm">${reply.author?.name || "Unknown"}</h5>
        <span class="text-xs text-gray-500">${formatTimeAgo(
          reply.created
        )}</span>
        <p class="text-gray-800 text-sm mt-1">${reply.body}</p>
        
        <div class="mt-1 flex items-center space-x-4">
          <button class="like-comment-btn text-xs text-gray-600 hover:text-blue-700" data-comment-id="${
            reply.id
          }">
            <i data-feather="heart" class="h-3 w-3 inline"></i>
            <span>${reply._count?.reactions || 0}</span> Like
          </button>
          ${
            currentUser && reply.author?.name === currentUser.name
              ? `
            <button class="edit-comment-btn text-xs text-gray-600 hover:text-blue-700" data-comment-id="${reply.id}">
              <i data-feather="edit" class="h-3 w-3 inline"></i> Edit
            </button>
            <button class="delete-comment-btn text-xs text-gray-600 hover:text-red-700" data-comment-id="${reply.id}">
              <i data-feather="trash-2" class="h-3 w-3 inline"></i> Delete
            </button>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;

  return div;
}
