import { apiGet } from "./api/getAPI.js";
import { createModal } from "./utility/modalHandler.js";
import { newPost } from "./posts/newPost.js";
import { updateCount } from "./utility/textCounter.js";
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

//Define page, limit
let page = 1;
const limit = 10;
let isLoading = false;

// Fetch and render
async function fetchAndRenderPosts() {
  if (isLoading) return;
  isLoading = true;

  try {
    const response = await apiGet("/social/posts?", {
      limit,
      page,
      _author: true,
      sort: "created",
      sortOrder: "desc",
    });

    const newPosts = response.data;

    postData = [...postData, ...newPosts];

    renderPosts(postData, undefined, {
      containerLayout: "column",
      cardLayout: "responsive",
    });

    // Show "Load More" if there are still more posts
    if (newPosts.length >= limit) {
      loadMoreBtn.style.display =
        "w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800";
    } else {
      loadMoreBtn.style.display = "none";
    }

    page++;

    newPost();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    renderErrorState();
  } finally {
    isLoading = false;
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

// Wait for DOM to load, THEN fetch posts
document.addEventListener("DOMContentLoaded", () => {
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  // Attach click handler
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      fetchAndRenderPosts();
    });
  }

  // Initial post load
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
