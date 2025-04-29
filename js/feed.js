import { apiGet } from "./api/getAPI.js";

// Initialize Feather icons
feather.replace();

// Define empty postData
let postData = [];

// Fetch and render
async function fetchAndRenderPosts() {
  try {
    const response = await apiGet("/social/posts", {
      limit: 10,
      offset: 0,
      _author: true,
      sort: "created",
      sortOrder: "desc",
    });

    postData = response.data; // Now it's an array!
    console.log(postData);

    renderPosts();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
}

// Render posts
function renderPosts() {
  const container = document.getElementById("postsContainer");
  if (!container) return;

  container.innerHTML = postData
    .map(
      (post, index) => `
      <div class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden ${
        index < postData.length - 1 ? "mb-8" : ""
      }">
        <div class="flex flex-col md:flex-row">
          <div class="w-full md:w-72 md:flex-shrink-0">
            <img 
              src="${post.media?.url || "../api/images/posts/fallback.jpg"}" 
              alt="${post.title || "Post Image"}"
              loading="lazy"
              class="w-full h-48 md:h-full object-cover">
          </div>
          <div class="flex-1 flex flex-col">
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-800">${
                post.title || "Untitled"
              }</h3>
              <p class="text-sm text-gray-500 mb-4">By ${
                post.author?.name || "Unknown"
              }</p>
              <div class="prose max-w-none">
                <p class="text-gray-700 whitespace-pre-line">${
                  post.body || ""
                }</p>
              </div>
            </div>
            <div class="p-6 border-t mt-auto">
              <div class="flex justify-between items-center">
                <div class="flex gap-4">
                  <button class="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                    <i data-feather="heart" class="h-4 w-4"></i>
                    ${post._count?.reactions ?? 0}
                  </button>
                  <button class="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                    <i data-feather="message-circle" class="h-4 w-4"></i>
                    ${post._count?.comments ?? 0}
                  </button>
                </div>
                <div class="flex gap-2">
                  <button class="text-gray-600 hover:text-gray-800">
                    <i data-feather="share-2" class="h-4 w-4"></i>
                  </button>
                  <button class="text-gray-600 hover:text-gray-800">
                    <i data-feather="bookmark" class="h-4 w-4"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  feather.replace();

  const buttons = container.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      console.log("Button clicked", e.currentTarget);
    });
  });
}

// ✅ Wait for DOM to load, THEN fetch posts
document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderPosts();
});
