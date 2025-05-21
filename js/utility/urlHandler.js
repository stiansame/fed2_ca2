/**
 * Gets a parameter value from the URL
 * @param {string} paramName - Name of the parameter
 * @returns {string|null} - Parameter value or null if not found
 */
export function getUrlParam(paramName) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(paramName);
}
