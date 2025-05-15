import { apiGet } from "../api/getAPI.js";
import { PROFILES } from "../api/apiEndpoints.js";
import { apiPut } from "../api/putAPI.js";
import { apiPost } from "../api/postAPI.js";
import { sanitizeHtml } from "../utility/sanitizer.js";

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

    const comments = response.data.comments || [];
    const sortedComments = comments.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
    return sortedComments;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
}
/**
 * Update post
 * @param {string} postID - ID of the post
 */
export async function updatePost(postID) {
  const updateBtn = document.getElementById("updatePostBtn");
  const updateForm = document.getElementById("editPostForm");

  if (!updateBtn || !updateForm) return;

  //get fields to update
  const titleInput = document.getElementById("editTitle");
  const contentInput = document.getElementById("editContent");
  const tagsInput = document.getElementById("editTags");
  const postImgUrlInput = document.getElementById("editPostImageUrl");

  try {
    const updatedPost = {
      title: titleInput.value,
      body: contentInput.value,
      tags: tagsInput.value.split(",").map((tag) => tag.trim()),
      media: {
        url: postImgUrlInput.value,
      },
    };

    console.log(updatedPost, postID);

    await apiPut(`/social/posts/${postID}`, updatedPost);
  } catch (error) {
    console.error("There was an error:", error);
    throw error;
  }
}

/**
 * Fetches posts data by name
 * @param {string} profileName - Name of the profile
 * @returns {Promise<Object>} - posts data
 */
export async function fetchPostsByProfile(userName) {
  try {
    const response = await apiGet(`${PROFILES}/${userName}/posts`, {
      sort: "created",
      sortOrder: "desc",
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch posts bt profile", error);
    throw error;
  }
}

/**
 *
 * @param {string} postId - ID of the post
 * @param {Number} replyToId - ID of the comment to reply to
 * @param {Object} contentValue - body and replyToID for comment
 */

export async function postComment(postId, replyToId = null, contentValue) {
  try {
    const body = contentValue;
    const newComment = {
      body: body,
      replyToId: replyToId,
    };

    console.log("Sending comment to API:", {
      url: `/social/posts/${postId}/comment`,
      payload: newComment,
    });

    // Post it
    await apiPost(`/social/posts/${postId}/comment`, newComment);
  } catch (error) {
    console.error("Failed to post comment", error);
    throw error;
  }
}
