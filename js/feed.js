import { apiGet } from "./api/getAPI.js";
import { createModal } from "./utility/createModal.js";
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
  const titleEl = document.getElementById("feedTitle");

  // hook up “Load More”
  loadMoreBtn.addEventListener("click", () => {
    fetchAndRenderPosts(loadMoreBtn);
  });

  // Map filter and H1 titles
  const titles = {
    allPosts: "All Posts",
    fedsPosts: "Latest Frontend Shitposting",
    following: "Latest from your followers",
    yourPosts: "Your Posts",
  };

  // hook up filter changes
  filterDropdown.addEventListener("change", (e) => {
    currentFilter = e.target.value;
    titleEl.textContent = titles[currentFilter] || "Feed";
    document.title = `FEDS feed | ${titles[currentFilter]}`;
    postData = [];
    page = 1;
    fetchAndRenderPosts(loadMoreBtn);
  });

  // set up modal
  createModal({
    openButtonSelector: "#newPostBtn",
    modalId: "modal",
    closeButtonId: "closeModal",
    formId: "newPostForm",
    onSubmit: ({ form }) => {
      /* … */
    },
  });

  //setup for image preview in Modal
  const loadImageBtn = document.getElementById("loadImageBtn");
  const imageUrlInput = document.getElementById("imageUrl");
  const imagePreview = document.getElementById("imagePreview");

  if (loadImageBtn && imageUrlInput && imagePreview) {
    loadImageBtn.addEventListener("click", () => {
      const url = imageUrlInput.value.trim();
      imagePreview.innerHTML = ""; // Clear previous
      if (url) {
        // Create an image element
        const img = document.createElement("img");
        img.src = url;
        img.alt = "Preview";
        img.className =
          "max-w-full w-full max-h-80 object-cover rounded-md border mt-2";
        img.onerror = () => {
          imagePreview.innerHTML = `<p class="text-red-500 text-sm mt-2">Could not load image. Check the URL.</p>`;
        };
        imagePreview.appendChild(img);
      }
    });
  }

  // Initial load
  fetchAndRenderPosts(loadMoreBtn);
});
