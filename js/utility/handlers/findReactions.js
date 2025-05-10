/**
 * Utility functions for interacting with post heart/like icons
 */

/**
 * Finds the heart icon in a post card element
 * @param {HTMLElement} card - The post card element
 * @returns {SVGElement|null} - The heart icon SVG element or null if not found
 */
export function findHeartIcon(card) {
  return (
    card.querySelector("#postLikeBtn svg") ||
    card.querySelector("svg[data-feather='heart']") ||
    (card.querySelector("#postLikeBtn") &&
      card.querySelector("#postLikeBtn").querySelector("svg")) ||
    null
  );
}

/**
 * Updates the heart icon's appearance based on liked state
 * @param {SVGElement} iconElement - The heart icon SVG element
 * @param {boolean} isLiked - Whether the post is liked
 */
export function updateHeartIcon(iconElement, isLiked) {
  if (!iconElement) return;

  const isLikedBool = Boolean(isLiked === true || isLiked === "true");

  // Set data attribute to track state
  iconElement.setAttribute("data-liked", isLikedBool);
  console.log(isLikedBool);

  // Update visual appearance
  const attributes = isLikedBool
    ? { "stroke-width": 2, stroke: "red", fill: "red" }
    : { "stroke-width": 2, stroke: "currentColor", fill: "none" };

  Object.entries(attributes).forEach(([attr, value]) => {
    iconElement.setAttribute(attr, value);
  });
}

/**
 * Toggles the liked state of a heart icon
 * @param {SVGElement} iconElement - The heart icon SVG element
 * @returns {boolean} - The new liked state
 */
export function toggleHeartIcon(iconElement) {
  if (!iconElement) return false;

  const isCurrentlyLiked = iconElement.getAttribute("data-liked") === "true";
  const newLikedState = !isCurrentlyLiked;

  updateHeartIcon(iconElement, newLikedState);
  return newLikedState;
}
