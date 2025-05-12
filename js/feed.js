import { apiGet } from "./api/getAPI.js";
import { createModal } from "./utility/modalHandler.js";
import { newPost } from "./posts/newPost.js";
import { updateCount } from "./utility/textCounter.js";
import { truncateTextAtWordBoundary } from "./utility/textTruncater.js";
import { renderPosts } from "./posts/renderAllposts.js";
import { isReacted } from "./utility/handlers/postHandlers.js";

//add eventlistener for characterCounter
window.addEventListener("DOMContentLoaded", () => {
  updateCount("content", "charCount");
});

// Initialize Feather icons
feather.replace();

// Define empty postData
let postData = [];

// Fetch and render
async function fetchAndRenderPosts() {
  try {
    const response = await apiGet("/social/posts?_tag=feds", {
      limit: 40,
      page: 1,
      _author: true,
      sort: "created",
      sortOrder: "desc",
    });

    postData = response.data; // Now it's an array!

    renderPosts(postData, undefined, {
      containerLayout: "column",
      cardLayout: "responsive",
    });
    newPost();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    renderErrorState();
  }
}

createModal({
  openButtonId: "newPostBtn",
  modalId: "modal",
  closeButtonId: "closeModal",
  formId: "newPostForm",
  image: {
    inputId: "imageUrlInput",
    previewId: "imagePreview",
  },
  onSubmit: ({ imageUrl, form }) => {
    const title = form.querySelector("#title").value;
    const content = form.querySelector("#content").value;
    const tags = Array.from(form.querySelector("#tags").value.split(","))
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    /*     savePost({ title, content, imageUrl, tags }); */
  },
});

// Render posts
/* export function renderPosts() {
  const container = document.querySelector(".postsContainer");
  if (!container) return;

  container.innerHTML = `
  ${postData
    .map(
      (post, index) => `
      <!-- post here -->
        <div 
          class="post-card grid bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden transform duration-300 hover:scale-103 hover:rotate-1 cursor-pointer ${
            index < postData.length - 1 ? "mb-8" : ""
          } md:grid-cols-2"
          data-url="/post/single.html?id=${post.id}"
        >

          <!-- Image Wrapper (Force 4:3 aspect ratio) -->
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
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-800">
                ${post.title || "Untitled"}
              </h3>
              <p class="text-sm text-gray-500 mb-4">By ${
                post.author?.name || "Unknown"
              }</p>
              <div class="prose max-w-none">
                <p class="text-gray-700 whitespace-pre-line" style="white-space: normal;">
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
                        class="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-full hover:bg-gray-300 transition-colors">
                        #${tag}
                      </a>`
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
        </div>
      `
    )
    .join("")}
`;

  // 🔗 Make entire card clickable (except buttons/links)
  document.querySelectorAll(".post-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("a")) {
        return;
      }
      const url = card.dataset.url;
      if (url) {
        window.location.href = url;
      }
    });
  });

  feather.replace();

  const buttons = container.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      console.log("Button clicked", e.currentTarget);
    });
  });
} */

// Wait for DOM to load, THEN fetch posts
document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderPosts();
});

/**
 * Renders an error state when profile fetching fails
 */
function renderErrorState() {
  // Display error message in posts section
  const postsContainer = document.querySelector(".postsContainer"); // <-- add this

  if (!postsContainer) return;

  postsContainer.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
            <p class="text-red-500">Failed to load posts. Make sure you are logged in.</p>
        </div>
    `;

  // return user to login page
  setTimeout(() => {
    window.location.href = "../../";
  }, 2000);
}
