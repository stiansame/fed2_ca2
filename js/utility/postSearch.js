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
      console.log("Search query:", query);

      if (query === "") {
        onReset();
        return;
      }

      try {
        const json = await apiGet(
          `/social/posts/search?q=${encodeURIComponent(query)}`
        );
        console.log("API search response:", json);

        const posts = json.data || [];

        console.log("Posts passed to renderPosts:", posts);

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
