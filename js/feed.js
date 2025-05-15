import { apiGet } from "./api/getAPI.js";
import { createModal } from "./utility/modalHandler.js";
import { newPost } from "./posts/newPost.js";
import { updateCount } from "./utility/textCounter.js";
import { renderPosts } from "./posts/renderAllposts.js";
import { isReacted } from "./utility/handlers/postHandlers.js";
import { fetchCurrentUser } from "./user/userChecks.js";

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

//Get current user
const userFromStorage = await fetchCurrentUser();
const currentUser = userFromStorage.name;

//Default filter
let currentFilter = "fedsPosts";

const fedsFilterUrl = "/social/posts/?_tag=feds";
const currentUserFilterUrl = `/social/profiles/${currentUser}/posts`;
const followingFilterUrl = "/social/posts/following";

// Fetch and render posts based on current filter
async function fetchAndRenderPosts() {
  if (isLoading) return;
  isLoading = true;

  // Apply filter parameters to query
  let filterUrl = "";

  switch (currentFilter) {
    case "fedsPosts":
      filterUrl = fedsFilterUrl;
      break;
    case "following":
      filterUrl = followingFilterUrl;
      break;
    case "yourPosts":
      filterUrl = currentUserFilterUrl;
      break;
    case "allPosts":
      filterUrl = "/social/posts";
      break;
    default:
      filterUrl = fedsFilterUrl;
      break;
  }

  try {
    //Get filtered posts
    const response = await apiGet(filterUrl, {
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

    // Show "Load More" button if there are more posts to load
    if (newPosts.length === limit) {
      loadMoreBtn.style.display = "block";
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

// Wait for DOM to load, THEN fetch posts
document.addEventListener("DOMContentLoaded", () => {
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  // Attach click handler
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      fetchAndRenderPosts(); // Fetch more posts on "Load More"
    });
  }
  // Initial post load
  fetchAndRenderPosts();
});

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

// Event listener to detect dropdown filter changes
const filterDropdown = document.getElementById("filterBy");
filterDropdown.addEventListener("change", function (event) {
  currentFilter = event.target.value; // Update the filter based on the dropdown selection
  postData = []; // Clear the existing posts
  page = 1; // Reset the page to 1 for the new filter
  fetchAndRenderPosts(); // Fetch posts with the new filter
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
