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
        console.error("Icon element not found!");
        return;
      }

      // Get current user's name
      const { name: username } = await fetchCurrentUser();

      // Fetch current post's reaction data
      const originalPost = await apiGet(`/social/posts/${postId}`);
      const originalReactors =
        originalPost.reactions?.flatMap((r) => r.reactors) || [];
      const wasReacted = originalReactors.includes(username);

      // Always use /react/{reaction}
      const reaction = "❤️";
      const toggleUrl = `/social/posts/${postId}/react/${reaction}`;

      // API toggles the reaction for you
      const response = await apiPut(toggleUrl, {});

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
      updateHeartIcon(iconElement, updatedReacted);

      // Update the like count display
      const countElement = card.querySelector(".like-count");
      if (countElement) {
        countElement.textContent = totalReactions;
      }

      // Return the updated result
      return {
        totalReactions,
        wasReacted: updatedReacted,
      };
    } catch (error) {
      console.error("Error fetching post reaction data:", error);
    }
  };
}
