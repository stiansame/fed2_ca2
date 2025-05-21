import { apiGet } from "../api/getAPI.js";
import { renderPosts } from "../posts/renderAllposts.js";

export function setupInstantPostSearch(
  inputElement,
  resultsContainer,
  options = {}
) {
  const debounceMs = options.debounceMs || 300;
  const onReset =
    options.onReset ||
    (() => {
      resultsContainer.innerHTML = "";
    });
  let debounceTimeout = null;

  inputElement.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      const query = inputElement.value.trim();

      if (query === "") {
        onReset();
        return;
      }

      try {
        const json = await apiGet(
          `/social/posts/search?q=${encodeURIComponent(query)}`
        );

        const posts = json.data || [];

        renderPosts(posts, resultsContainer, {
          containerLayout: "column",
          cardLayout: "responsive",
        });
      } catch (err) {
        resultsContainer.innerHTML = `<div class="text-red-600">Error loading results.</div>`;
        console.error("Error fetching or rendering search results:", err);
      }
    }, debounceMs);
  });
}
