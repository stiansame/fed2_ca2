import { apiGet } from "./api/getAPI.js";
import { createModal } from "./utility/modalHandler.js";
import { updateCount } from "./utility/textCounter.js";

// Initialize Feather icons
feather.replace();

// Get post ID from URL
function getPostIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Global post data
let postData = null;
let comments = [];
let currentUser = null;

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Feather icons
  feather.replace();

  // Initialize modals
  initializeModals();

  // Add event listeners for character counters
  updateCount("content", "charCount");
  updateCount("editContent", "editCharCount");

  // Get post ID from URL
  const postId = getPostIdFromUrl();

  if (postId) {
    fetchPost(postId);
    fetchComments(postId);
    fetchCurrentUser();
  } else {
    displayNotification("Post ID not found in URL", "error");
    setTimeout(() => {
      window.location.href = "../feed/";
    }, 2000);
  }

  // Setup event listeners
  setupEventListeners();
});

// Initialize all modals
function initializeModals() {
  // New post modal
  createModal({
    openButtonId: "newPostBtn",
    modalId: "modal",
    closeButtonId: "closeModal",
    formId: "newPostForm",
    image: {
      inputId: "imageUrlInput",
      previewId: "imagePreview",
    },
    onSubmit: ({ imageUrl, form }) => {
      const title = form.querySelector("#title").value;
      const content = form.querySelector("#content").value;
      const tags = Array.from(form.querySelector("#tags").value.split(","))
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Handle new post creation
      // savePost({ title, content, imageUrl, tags });
    },
  });

  // Edit post modal
  document.getElementById("closeEditModal").addEventListener("click", () => {
    document.getElementById("editModal").classList.add("hidden");
  });

  // Reply modal
  document.getElementById("closeReplyModal").addEventListener("click", () => {
    document.getElementById("replyModal").classList.add("hidden");
  });
}

// Setup all event listeners
function setupEventListeners() {
  // Like button
  document
    .getElementById("sidebarLikeButton")
    .addEventListener("click", handleLikeClick);

  // Comment button
  document
    .getElementById("sidebarCommentButton")
    .addEventListener("click", handleCommentClick);

  // Follow button
  document
    .getElementById("sidebarFollowButton")
    .addEventListener("click", handleFollowClick);

  // Edit button
  document
    .getElementById("sidebarEditButton")
    .addEventListener("click", handleEditClick);

  // Comment form
  document
    .getElementById("commentForm")
    .addEventListener("submit", handleCommentSubmit);

  // Edit post form
  document
    .getElementById("editPostForm")
    .addEventListener("submit", handleEditSubmit);

  // Delete post button
  document
    .getElementById("deletePostBtn")
    .addEventListener("click", handleDeletePost);

  // Reply form
  document
    .getElementById("replyForm")
    .addEventListener("submit", handleReplySubmit);
}

// Fetch single post
async function fetchPost(postId) {
  try {
    const response = await apiGet(`/social/posts/${postId}`, {
      _author: true,
      _comments: true,
      _reactions: true,
    });

    postData = response.data;
    renderPost();

    // Check if current user is post owner
    checkPostOwnership();
  } catch (error) {
    console.error("Failed to fetch post:", error);
    displayNotification("Failed to load post", "error");
  }
}

// Fetch comments for the post
async function fetchComments(postId) {
  try {
    const response = await apiGet(`/social/posts/${postId}/comments`, {
      _author: true,
      sort: "created",
      sortOrder: "desc",
    });

    comments = response.data;
    renderComments();
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    displayNotification("Failed to load comments", "error");
  }
}

// Fetch current user
async function fetchCurrentUser() {
  try {
    const response = await apiGet("/social/profiles/me");
    currentUser = response.data;

    // Check if current user is post owner
    checkPostOwnership();
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    // Don't redirect here as they can still view posts without being logged in
  }
}

// Check if current user is post owner
function checkPostOwnership() {
  if (
    postData &&
    currentUser &&
    postData.author &&
    postData.author.name === currentUser.name
  ) {
    document.getElementById("sidebarEditButton").classList.remove("hidden");
  }
}

// Render single post
function renderPost() {
  if (!postData) return;

  // Set post data in the HTML
  document.getElementById("postTitle").textContent =
    postData.title || "Untitled Post";
  document.getElementById("postContent").textContent =
    postData.body || "No content";
  document.getElementById("postAuthor").textContent =
    postData.author?.name || "Unknown";
  document.getElementById("postDate").textContent = `Posted on ${formatDate(
    postData.created
  )}`;
  document.getElementById("likeCount").textContent =
    postData._count?.reactions || 0;
  document.getElementById("commentCount").textContent =
    postData._count?.comments || 0;
  document.getElementById("followerCount").textContent =
    postData.author?._count?.followers || 0;

  // Set post image
  const postImage = document.getElementById("postImage");
  if (postData.media && postData.media.url) {
    postImage.src = postData.media.url;
    postImage.alt = postData.title || "Post image";
  } else {
    postImage.src = "../api/images/posts/fallback.jpg";
    postImage.alt = "Default post image";
  }

  // Render tags
  const tagsContainer = document.getElementById("postTags");
  tagsContainer.innerHTML = "";

  if (postData.tags && postData.tags.length > 0) {
    postData.tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className =
        "px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full";
      tagElement.textContent = `#${tag}`;
      tagsContainer.appendChild(tagElement);
    });
  } else {
    const noTagsElement = document.createElement("span");
    noTagsElement.className = "text-gray-500 text-xs";
    noTagsElement.textContent = "No tags";
    tagsContainer.appendChild(noTagsElement);
  }

  // Update document title
  document.title = `FEDS | ${postData.title || "Post"}`;

  // Re-initialize Feather icons
  feather.replace();
}

// Render comments
function renderComments() {
  const commentsContainer = document.getElementById("commentsContainer");
  commentsContainer.innerHTML = "";

  if (!comments || comments.length === 0) {
    commentsContainer.innerHTML = `
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
    const commentElement = createCommentElement(comment);

    // Add replies if any
    if (repliesByParent[comment.id] && repliesByParent[comment.id].length > 0) {
      const repliesContainer = document.createElement("div");
      repliesContainer.className =
        "mt-3 pl-6 border-l-2 border-gray-100 space-y-3";

      repliesByParent[comment.id].forEach((reply) => {
        const replyElement = createReplyElement(reply);
        repliesContainer.appendChild(replyElement);
      });

      commentElement.querySelector(".flex-grow").appendChild(repliesContainer);
    }

    commentsContainer.appendChild(commentElement);
  });

  // Re-initialize Feather icons
  feather.replace();

  // Add event listeners to comment action buttons
  addCommentEventListeners();
}

// Create comment element
function createCommentElement(comment) {
  const div = document.createElement("div");
  div.className = "p-4";
  div.dataset.commentId = comment.id;

  div.innerHTML = `
    <div class="flex items-start space-x-3">
      <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <i data-feather="user" class="h-5 w-5 text-blue-700"></i>
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

// Create reply element
function createReplyElement(reply) {
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

// Add event listeners to comment action buttons
function addCommentEventListeners() {
  // Like comment buttons
  document.querySelectorAll(".like-comment-btn").forEach((button) => {
    button.addEventListener("click", handleLikeComment);
  });

  // Reply comment buttons
  document.querySelectorAll(".reply-comment-btn").forEach((button) => {
    button.addEventListener("click", handleReplyToComment);
  });

  // Edit comment buttons
  document.querySelectorAll(".edit-comment-btn").forEach((button) => {
    button.addEventListener("click", handleEditComment);
  });

  // Delete comment buttons
  document.querySelectorAll(".delete-comment-btn").forEach((button) => {
    button.addEventListener("click", handleDeleteComment);
  });
}

// Handler functions for post actions
function handleLikeClick() {
  if (!currentUser) {
    displayNotification("You need to be logged in to like posts", "warning");
    return;
  }

  // Toggle like icon
  const icon = this.querySelector("i");
  icon.setAttribute(
    "fill",
    icon.getAttribute("fill") === "currentColor" ? "none" : "currentColor"
  );

  // TODO: Send API request to like/unlike post
  console.log("Like post", postData.id);

  // For now, just update UI
  const likeCount = document.getElementById("likeCount");
  const currentLikes = parseInt(likeCount.textContent);
  likeCount.textContent =
    icon.getAttribute("fill") === "currentColor"
      ? currentLikes + 1
      : currentLikes - 1;

  displayNotification(
    "Post " +
      (icon.getAttribute("fill") === "currentColor" ? "liked" : "unliked"),
    "success"
  );
}

function handleCommentClick() {
  // Scroll to comment form and focus
  const commentForm = document.getElementById("commentForm");
  const commentInput = document.getElementById("newComment");

  commentForm.scrollIntoView({ behavior: "smooth" });
  commentInput.focus();
}

function handleFollowClick() {
  if (!currentUser) {
    displayNotification("You need to be logged in to follow users", "warning");
    return;
  }

  // Toggle follow button text
  const button = this;
  const isFollowing = button.textContent.trim() === "Unfollow";

  button.innerHTML = isFollowing
    ? `<i data-feather="user-plus" class="h-3 w-3"></i><span>Follow</span>`
    : `<i data-feather="user-check" class="h-3 w-3"></i><span>Unfollow</span>`;

  // Re-initialize feather icons for the button
  feather.replace();

  // TODO: Send API request to follow/unfollow user
  console.log("Follow user", postData.author.name);

  // Update follower count
  const followerCount = document.getElementById("followerCount");
  const currentFollowers = parseInt(followerCount.textContent);
  followerCount.textContent = isFollowing
    ? currentFollowers - 1
    : currentFollowers + 1;

  displayNotification(
    isFollowing ? "Unfollowed user" : "Followed user",
    "success"
  );
}

function handleEditClick() {
  if (!currentUser || postData.author?.name !== currentUser.name) {
    displayNotification("You can only edit your own posts", "error");
    return;
  }

  // Populate edit form
  document.getElementById("editTitle").value = postData.title || "";
  document.getElementById("editContent").value = postData.body || "";
  document.getElementById("editTags").value = postData.tags
    ? postData.tags.join(", ")
    : "";
  document.getElementById("editImageUrl").value = postData.media?.url || "";

  // Show image preview if available
  const editImagePreview = document.getElementById("editImagePreview");
  if (postData.media?.url) {
    editImagePreview.innerHTML = `<img src="${postData.media.url}" alt="Preview" class="w-full h-32 object-cover rounded-md">`;
  } else {
    editImagePreview.innerHTML = "";
  }

  // Show edit modal
  document.getElementById("editModal").classList.remove("hidden");

  // Update character count
  updateCount("editContent", "editCharCount");
}

// Handler functions for comment actions
function handleLikeComment() {
  if (!currentUser) {
    displayNotification("You need to be logged in to like comments", "warning");
    return;
  }

  const commentId = this.dataset.commentId;

  // Toggle like icon
  const icon = this.querySelector("i");
  icon.setAttribute(
    "fill",
    icon.getAttribute("fill") === "currentColor" ? "none" : "currentColor"
  );

  // TODO: Send API request to like/unlike comment
  console.log("Like comment", commentId);

  // For now, just update UI
  const countSpan = this.querySelector("span");
  const currentLikes = parseInt(countSpan.textContent);
  countSpan.textContent =
    icon.getAttribute("fill") === "currentColor"
      ? currentLikes + 1
      : currentLikes - 1;

  displayNotification(
    "Comment " +
      (icon.getAttribute("fill") === "currentColor" ? "liked" : "unliked"),
    "success"
  );
}

function handleReplyToComment() {
  if (!currentUser) {
    displayNotification(
      "You need to be logged in to reply to comments",
      "warning"
    );
    return;
  }

  const commentId = this.dataset.commentId;

  // Set parent comment ID in the form
  document.getElementById("parentCommentId").value = commentId;

  // Clear previous content
  document.getElementById("replyContent").value = "";

  // Show reply modal
  document.getElementById("replyModal").classList.remove("hidden");
}

function handleEditComment() {
  // TODO: Implement edit comment functionality
  const commentId = this.dataset.commentId;
  console.log("Edit comment", commentId);
}

function handleDeleteComment() {
  // TODO: Implement delete comment functionality
  if (confirm("Are you sure you want to delete this comment?")) {
    const commentId = this.dataset.commentId;
    console.log("Delete comment", commentId);
  }
}

// Form submission handlers
function handleCommentSubmit(e) {
  e.preventDefault();

  if (!currentUser) {
    displayNotification("You need to be logged in to comment", "warning");
    return;
  }

  const commentInput = document.getElementById("newComment");
  const commentText = commentInput.value.trim();

  if (!commentText) {
    displayNotification("Comment cannot be empty", "error");
    return;
  }

  // TODO: Send API request to create comment
  console.log("Create comment", postData.id, commentText);

  // For now, just add a mock comment to the UI
  const mockComment = {
    id: "temp-" + Date.now(),
    body: commentText,
    created: new Date().toISOString(),
    author: {
      name: currentUser.name,
    },
    _count: {
      reactions: 0,
    },
  };

  comments.unshift(mockComment);
  renderComments();

  // Clear input
  commentInput.value = "";

  // Update comment count
  const commentCount = document.getElementById("commentCount");
  commentCount.textContent = parseInt(commentCount.textContent) + 1;

  displayNotification("Comment added successfully", "success");
}

function handleEditSubmit(e) {
  e.preventDefault();

  if (!currentUser || postData.author?.name !== currentUser.name) {
    displayNotification("You can only edit your own posts", "error");
    return;
  }

  const title = document.getElementById("editTitle").value.trim();
  const content = document.getElementById("editContent").value.trim();
  const tags = document
    .getElementById("editTags")
    .value.split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
  const imageUrl = document.getElementById("editImageUrl").value.trim();

  if (!title) {
    displayNotification("Title cannot be empty", "error");
    return;
  }

  // TODO: Send API request to update post
  console.log("Update post", postData.id, { title, content, tags, imageUrl });

  // For now, just update the UI
  postData.title = title;
  postData.body = content;
  postData.tags = tags;

  if (postData.media) {
    postData.media.url = imageUrl;
  } else if (imageUrl) {
    postData.media = { url: imageUrl };
  }

  renderPost();

  // Hide edit modal
  document.getElementById("editModal").classList.add("hidden");

  displayNotification("Post updated successfully", "success");
}

function handleDeletePost() {
  if (!currentUser || postData.author?.name !== currentUser.name) {
    displayNotification("You can only delete your own posts", "error");
    return;
  }

  if (confirm("Are you sure you want to delete this post?")) {
    // TODO: Send API request to delete post
    console.log("Delete post", postData.id);

    // Redirect to feed page
    displayNotification("Post deleted successfully", "success");
    setTimeout(() => {
      window.location.href = "../feed/";
    }, 1500);
  }
}

function handleReplySubmit(e) {
  e.preventDefault();

  if (!currentUser) {
    displayNotification("You need to be logged in to reply", "warning");
    return;
  }

  const parentCommentId = document.getElementById("parentCommentId").value;
  const replyContent = document.getElementById("replyContent").value.trim();

  if (!replyContent) {
    displayNotification("Reply cannot be empty", "error");
    return;
  }

  // TODO: Send API request to create reply
  console.log("Create reply", postData.id, parentCommentId, replyContent);

  // For now, just add a mock reply to the UI
  const mockReply = {
    id: "temp-reply-" + Date.now(),
    body: replyContent,
    created: new Date().toISOString(),
    replyToId: parentCommentId,
    author: {
      name: currentUser.name,
    },
    _count: {
      reactions: 0,
    },
  };

  comments.push(mockReply);
  renderComments();

  // Hide reply modal
  document.getElementById("replyModal").classList.add("hidden");

  displayNotification("Reply added successfully", "success");
}

// Helper functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.floor((now - date) / 1000);

  if (diffSeconds < 60) {
    return "just now";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }

  return formatDate(dateString);
}

// Display notification
function displayNotification(message, type = "info") {
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notificationMessage");

  // Set message
  notificationMessage.textContent = message;

  // Set color based on type
  notification.className =
    "fixed bottom-20 right-4 max-w-md transform transition-transform duration-300";

  switch (type) {
    case "success":
      notification.classList.add(
        "bg-green-200",
        "border-l-4",
        "border-green-600",
        "text-green-800"
      );
      break;
    case "error":
      notification.classList.add(
        "bg-red-200",
        "border-l-4",
        "border-red-600",
        "text-red-800"
      );
      break;
    case "warning":
      notification.classList.add(
        "bg-yellow-200",
        "border-l-4",
        "border-yellow-600",
        "text-yellow-800"
      );
      break;
    default:
      notification.classList.add(
        "bg-blue-200",
        "border-l-4",
        "border-blue-600",
        "text-blue-800"
      );
  }

  // Show notification
  notification.classList.remove("translate-y-full");

  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.add("translate-y-full");
  }, 3000);
}
