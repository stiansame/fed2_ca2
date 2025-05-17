import { truncateTextAtWordBoundary } from "../utility/textTruncater.js";
import { formatTimeAgo } from "../utility/dateFormatter.js";
import { isReacted } from "../utility/handlers/postHandlers.js";
import { createLikeButtonHandler } from "../utility/handlers/likeHandlers.js";
import { findHeartIcon } from "../utility/handlers/findReactions.js";

export function renderPosts(
  posts,
  container = document.querySelector(".postsContainer"),
  options = {}
) {
  if (!container) {
    console.error("renderPosts: No container element provided or found.");
    return;
  }
  const { containerLayout = "column", cardLayout = "responsive" } = options;

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
      card grid bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden 
      transform duration-300 hover:scale-103 hover:rotate-1 cursor-pointer 
      ${cardLayout === "responsive" ? "md:grid-cols-2" : "grid-cols-1"} 
      ${index < posts.length - 1 ? "mb-4" : ""}
    `
      .trim()
      .replace(/\s+/g, " ");

    card.dataset.url = `/post/single.html?id=${post.id}`;

    // Set up author/date info
    const postDate = post.created
      ? formatTimeAgo(post.created)
      : "Unknown date";
    const authorInfo =
      containerLayout === "grid"
        ? `${postDate}`
        : `By ${post.author?.name || "Unknown"} <em>${postDate}</em>`;

    // -- Like button: add id="postLikeBtn" and class "like-btn", count span --
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
      <div class="flex flex-col">
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800">
            ${post.title || "Untitled"}
          </h3>
          <p class="text-xs text-gray-500 mb-2">${authorInfo}</p>
          <div class="prose max-w-none">
            <p class="test-sm text-gray-700 whitespace-pre-line" style="white-space: normal;">
              ${
                truncateTextAtWordBoundary(post.body, 100) ||
                "Post has no text..."
              }
            </p>
          </div>
        </div>
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
        <div class="p-4 border-t mt-auto">
          <div class="flex justify-between items-center">
            <div class="flex gap-4">
              <button id="postLikeBtn" class="like-btn flex items-center gap-1 text-gray-600 hover:text-gray-800" type="button">
                <i data-feather="heart" class="h-4 w-4"></i>
                <span class="like-count">${post._count?.reactions ?? 0}</span>
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

    // ---- SET LIKED STATE ON LOAD ----
    if (window.feather) window.feather.replace({ elements: [card] });

    isReacted(card, post);

    // ---- ATTACH TOGGLE HANDLER ----
    const likeBtn = card.querySelector("#postLikeBtn");
    if (likeBtn) {
      likeBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevents the card click from firing
        createLikeButtonHandler(card, post.id)();
      });
    }
  });

  // Make cards clickable (but not when a button or link inside is clicked)
  container.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("a")) return;
      const url = card.dataset.url;
      if (url) window.location.href = url;
    });
  });

  if (window.feather) feather.replace();
}
