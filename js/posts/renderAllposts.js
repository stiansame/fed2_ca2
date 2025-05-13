import { truncateTextAtWordBoundary } from "../utility/textTruncater.js";
import { formatTimeAgo } from "../utility/dateFormatter.js"; // Importing the function

export function renderPosts(
  posts,
  container = document.querySelector(".postsContainer"),
  options = {}
) {
  if (!container) {
    console.error("renderPosts: No container element provided or found.");
    return;
  }

  const {
    containerLayout = "column", // 'column' or 'grid'
    cardLayout = "responsive", // 'stacked' or 'responsive'
  } = options;

  // PAGE layout
  container.innerHTML = "";
  container.className = `postsContainer ${
    containerLayout === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      : "flex flex-col gap-2 px-4 max-w-2xl mx-auto"
  }`;

  posts.forEach((post, index) => {
    const card = document.createElement("div");
    card.className = `
      post-card grid bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden 
      transform duration-300 hover:scale-103 hover:rotate-1 cursor-pointer 
      ${cardLayout === "responsive" ? "md:grid-cols-2" : "grid-cols-1"} 
      ${index < posts.length - 1 ? "mb-4" : ""}
    `
      .trim()
      .replace(/\s+/g, " ");

    card.dataset.url = `/post/single.html?id=${post.id}`;

    // Ensure createdAt exists and is valid
    const postDate = post.created
      ? formatTimeAgo(post.created)
      : "Unknown date";

    // Modify author info based on layout
    const authorInfo =
      containerLayout === "grid"
        ? `${postDate}` // Only show date when layout is "grid"
        : `By ${post.author?.name || "Unknown"} <em>${postDate}</em>`; // Show both author and date for "column" layout

    card.innerHTML = `
      <!-- Image Wrapper -->
      <div class="image-wrapper h-48 md:h-full relative overflow-hidden" style="padding-top: 75%;">
        <img 
          src="${post.media?.url || "../api/images/posts/fallback.jpg"}" 
          alt="${post.title || "Post Image"}"
          loading="lazy"
          class="image w-full h-full object-cover absolute top-0 left-0"
        >
      </div>

      <!-- Content -->
      <div class="flex flex-col">
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800">
            ${post.title || "Untitled"}
          </h3>
          <p class="text-xs text-gray-500 mb-2">${authorInfo}</p> <!-- Updated to only show date in grid layout -->
          <div class="prose max-w-none">
            <p class="test-sm text-gray-700 whitespace-pre-line" style="white-space: normal;">
              ${
                truncateTextAtWordBoundary(post.body, 100) ||
                "Post has no text..."
              }
            </p>
          </div>
        </div>

        <!-- Tags -->
        <div class="p-4">
          <div class="flex flex-wrap gap-2">
            ${
              post.tags
                ?.map(
                  (tag) => `
              <a href="/tags/${encodeURIComponent(tag)}" 
                 class="px-2 py-0.5 bg-gray-200 text-gray-800 text-xs rounded-full hover:bg-gray-300 transition-colors">
                #${tag}
              </a>
            `
                )
                .join("") || ""
            }
          </div>
        </div>

        <!-- Reactions -->
        <div class="p-4 border-t mt-auto">
          <div class="flex justify-between items-center">
            <div class="flex gap-4">
              <button class="flex items-center gap-1 text-gray-600 hover:text-gray-800" type="button">
                <i data-feather="heart" class="h-4 w-4"></i>
                ${post._count?.reactions ?? 0}
              </button>
              <button class="flex items-center gap-1 text-gray-600 hover:text-gray-800" type="button">
                <i data-feather="message-circle" class="h-4 w-4"></i>
                ${post._count?.comments ?? 0}
              </button>
            </div>
            <div class="flex gap-2">
              <button class="text-gray-600 hover:text-gray-800" type="button">
                <i data-feather="share-2" class="h-4 w-4"></i>
              </button>
              <button class="text-gray-600 hover:text-gray-800" type="button">
                <i data-feather="bookmark" class="h-4 w-4"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Make cards clickable
  container.querySelectorAll(".post-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("a")) return;
      const url = card.dataset.url;
      if (url) window.location.href = url;
    });
  });

  if (window.feather) feather.replace();
}
