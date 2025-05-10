import { apiGet } from "../api/getAPI.js";
import { PROFILES } from "../api/apiEndpoints.js";

/**
 * Fetches post data by ID
 * @param {string} postId - ID of the post to fetch
 * @returns {Promise<Object>} - Post data
 */
export async function fetchPost(postId) {
  try {
    const response = await apiGet(`/social/posts/${postId}`, {
      _author: true,
      _comments: true,
      _reactions: true,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch post:", error);
    throw error;
  }
}

/**
 * Fetches profile data by name
 * @param {string} profileName - Name of the profile
 * @returns {Promise<Object>} - Profile data
 */
export async function fetchProfileData(profileName) {
  try {
    const response = await apiGet(`${PROFILES}/${profileName}`, {
      _followers: true,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    throw error;
  }
}

/**
 * Fetches comments for a post
 * @param {string} postId - ID of the post
 * @returns {Promise<Array>} - Array of comments
 */
export async function fetchComments(postId) {
  try {
    const response = await apiGet(`/social/posts/${postId}`, {
      _author: true,
      _comments: true,
      sort: "created",
      sortOrder: "desc",
    });
    return response.data.comments;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
}
