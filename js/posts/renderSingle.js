import { apiGet } from "./api/getAPI.js";
import { createModal } from "./utility/modalHandler.js";

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

// Fetch single post
async function fetchPost(postId) {
  try {
    const response = await apiGet(`/social/posts/${postId}`, {
      _author: true,
      _comments: true,
      _reactions: true,
    });

    postData = response.data;
    console.log(postData);

    /*     // Check if current user is post owner
    checkPostOwnership(); */
  } catch (error) {
    console.error("Failed to fetch post:", error);
    /*     displayNotification("Failed to load post", "error"); */
  }
}
