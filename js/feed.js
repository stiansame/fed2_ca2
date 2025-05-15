import { apiGet } from "./api/getAPI.js";
import { createModal } from "./utility/modalHandler.js";
import { newPost } from "./posts/newPost.js";
import { updateCount } from "./utility/textCounter.js";
import { renderPosts } from "./posts/renderAllposts.js";
import { isReacted } from "./utility/handlers/postHandlers.js";
import { fetchCurrentUser } from "./user/userChecks.js";

// define state
let postData = [];
let page = 1;
const limit = 10;
let isLoading = false;
let currentFilter = "fedsPosts";

// Filter URLs...
const fedsFilterUrl = "/social/posts/?_tag=feds";
const followingFilterUrl = "/social/posts/following";
let currentUserFilterUrl;

async function fetchAndRenderPosts(loadMoreBtn) {
  if (isLoading) return;
  isLoading = true;

  // pick filter URL
  let filterUrl;
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
    const { data: newPosts } = await apiGet(filterUrl, {
      limit,
      page,
      _author: true,
      sort: "created",
      sortOrder: "desc",
    });

    postData = [...postData, ...newPosts];
    renderPosts(postData, undefined, {
      containerLayout: "column",
      cardLayout: "responsive",
    });

    // show/hide Load More
    if (newPosts.length === limit) {
      loadMoreBtn.style.display = "block";
    } else {
      loadMoreBtn.style.display = "none";
    }

    page++;
    newPost();
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    renderErrorState();
  } finally {
    isLoading = false;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  updateCount("content", "charCount");
  feather.replace();

  // fetch current user
  const { name: currentUser } = await fetchCurrentUser();
  currentUserFilterUrl = `/social/profiles/${currentUser}/posts`;

  // grab the DOM elements after they’re parsed
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const filterDropdown = document.getElementById("filterBy");

  // hook up “Load More”
  loadMoreBtn.addEventListener("click", () => {
    fetchAndRenderPosts(loadMoreBtn);
  });

  // hook up filter changes
  filterDropdown.addEventListener("change", (e) => {
    currentFilter = e.target.value;
    postData = [];
    page = 1;
    fetchAndRenderPosts(loadMoreBtn);
  });

  // set up modal
  createModal({
    openButtonId: "newPostBtn",
    modalId: "modal",
    closeButtonId: "closeModal",
    formId: "newPostForm",
    image: { inputId: "imageUrlInput", previewId: "imagePreview" },
    onSubmit: ({ form }) => {
      /* … */
    },
  });

  // Initial load
  fetchAndRenderPosts(loadMoreBtn);
});
