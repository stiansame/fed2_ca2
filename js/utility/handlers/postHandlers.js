import { fetchCurrentUser } from "../../user/userChecks.js";
import { findHeartIcon, updateHeartIcon } from "./findReactions.js";

/**
 * Updates the post card to reflect if the current user has reacted to it
 * and updates the like counter with accurate count
 *
 * @param {HTMLElement} card - The post card element
 * @param {Object} postData - The post data from the server
 */
export async function isReacted(card, postData) {
  try {
    const currentUser = await fetchCurrentUser();
    const currentUserName = currentUser.name;

    // Check if the current user has reacted to the post
    const reacted = hasReacted(postData, currentUserName);

    // Get the like count from the post data
    const likeCount = postData._count.reactions || 0;

    // Find and update the heart icon
    const iconElement = findHeartIcon(card);
    if (iconElement) {
      updateHeartIcon(iconElement, reacted);
    }

    // Update the like counter with accurate count from server
    const likeCounter = card.querySelector(".like-count");
    if (likeCounter) {
      likeCounter.textContent = likeCount;
    }
  } catch (error) {
    console.error("Error in isReacted:", error);
  }
}

/**
 * Checks if a user has reacted to a post
 *
 * @param {Object} post - The post data
 * @param {string} name - The username to check
 * @returns {boolean} - Whether the user has reacted
 */
function hasReacted(post, name) {
  return (
    post.reactions &&
    post.reactions.some(
      (reaction) => reaction.reactors && reaction.reactors.includes(name)
    )
  );
}
