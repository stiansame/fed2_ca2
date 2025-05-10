import { displayNotification } from "../displayUserNotifications.js";
import { apiPut } from "../../api/putAPI.js";
import { apiGet } from "../../api/getAPI.js";
import { fetchCurrentUser } from "../../user/userChecks.js";
import { findHeartIcon, updateHeartIcon } from "./findReactions.js";

/**
 * Handles generic reaction toggle with total count update
 *
 * @param {HTMLElement} card - The post card element
 * @param {string} postId - The ID of the post
 * @returns {Function} - The event handler function
 */
export function createLikeButtonHandler(card, postId) {
  return async () => {
    try {
      // Find icon element
      const iconElement = findHeartIcon(card);
      if (!iconElement) {
        console.log("Icon element not found!");
        return;
      }

      // Get current user's name
      const { name: username } = await fetchCurrentUser();

      // Fetch current post's reaction data
      const originalPost = await apiGet(`/social/posts/${postId}`);
      const originalReactors =
        originalPost.reactions?.flatMap((r) => r.reactors) || [];
      const wasReacted = originalReactors.includes(username);

      // Toggle the reaction (use ❤️ for simplicity)
      const reaction = "❤️";
      const toggleUrl = wasReacted
        ? `/social/posts/${postId}/unreact/${reaction}` // If user reacted, remove it
        : `/social/posts/${postId}/react/${reaction}`; // If user hasn't reacted, add it

      const response = await apiPut(toggleUrl);

      // Fetch the updated post data after the toggle
      const updatedPost = response.data;

      // Recalculate total reactions
      const totalReactions =
        updatedPost.reactions?.reduce((sum, r) => sum + r.count, 0) || 0;

      // Get the updated list of reactors
      const updatedReactors =
        updatedPost.reactions?.flatMap((r) => r.reactors) || [];
      const updatedReacted = updatedReactors.includes(username);

      // Update the heart icon based on the new reaction status
      updateHeartIcon(iconElement, updatedReacted); // Icon should show 'liked' if now reacted

      // Update the like count display
      const countElement = card.querySelector(".like-count");
      if (countElement) {
        countElement.textContent = totalReactions;
      }

      // Return the updated result
      return {
        totalReactions,
        wasReacted: updatedReacted, // Return the actual reaction status after update
      };
    } catch (error) {
      console.error("Error fetching post reaction data:", error);
    }
  };
}
