import { apiGet } from "./api/getAPI.js";
import { createModal } from "./utility/createModal.js";
import { newPost } from "./posts/newPost.js";
import { updateCount } from "./utility/textCounter.js";
import { renderPosts } from "./posts/renderAllposts.js";
import { fetchCurrentUser } from "./user/userChecks.js";
import { addNewPostListener } from "./utility/eventListeners.js";

// ---- FEED STATE ----
let postData = [];
let page = 1;
const limit = 10;
let isLoading = false;
let currentFilter = "fedsPosts";
let currentUserFilterUrl;

// --- TAG FILTER ADDITIONS ---
let tagFilter = null;
function getTagFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("tag");
}
tagFilter = getTagFromUrl();
// --- END TAG FILTER ADDITIONS ---

// ---- SEARCH STATE ----
let searchData = [];
let searchPage = 1;
let searchQuery = "";
let searchIsLoading = false;
let searchMode = false;

// ---- DOM ELEMENTS ----
const postsContainer = document.querySelector(".postsContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const filterDropdown = document.getElementById("filterBy");
const feedTitle = document.getElementById("feedTitle");
const searchInput = document.getElementById("search");

// ---- FILTER URLS ----
const fedsFilterUrl = "/social/posts/?_tag=feds";
const followingFilterUrl = "/social/posts/following";

// ---- FETCH AND RENDER POSTS (FEED) ----
async function fetchAndRenderPosts(loadMoreBtn) {
  if (isLoading) return;
  isLoading = true;

  // --- TAG FILTER ---
  let filterUrl;
  if (tagFilter) {
    filterUrl = `/social/posts/?_tag=${encodeURIComponent(tagFilter)}`;
    if (feedTitle) {
      feedTitle.textContent = `Posts tagged #${tagFilter}`;
      document.title = `FEDS | #${tagFilter}`;
    }
  } else {
    // pick filter URL
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
    if (feedTitle && !searchMode) {
      const titles = {
        allPosts: "All Posts",
        fedsPosts: "Latest Frontend Shitposting",
        following: "Latest from your followers",
        yourPosts: "Your Posts",
      };
      feedTitle.textContent = titles[currentFilter] || "Feed";
      document.title = `FEDS feed | ${titles[currentFilter]}`;
    }
  }

  try {
    const { data: newPosts } = await apiGet(filterUrl, {
      limit,
      page,
      _author: true,
      _reactions: true,
      sort: "created",
      sortOrder: "desc",
    });

    postData = [...postData, ...newPosts];
    renderPosts(postData, postsContainer, {
      containerLayout: "column",
      cardLayout: "responsive",
    });

    if (newPosts.length === limit) {
      loadMoreBtn.style.display = "block";
    } else {
      loadMoreBtn.style.display = "none";
    }

    page++;
    newPost();
  } catch (err) {
    postsContainer.innerHTML = `<div class="text-red-600">Error loading posts.</div>`;
    loadMoreBtn.style.display = "none";
    console.error("Failed to fetch posts:", err);
  } finally {
    isLoading = false;
  }
}

// ---- FETCH AND RENDER POSTS (SEARCH) ----
async function fetchAndRenderSearch(loadMoreBtn) {
  if (searchIsLoading) return;
  searchIsLoading = true;

  try {
    const { data: newPosts } = await apiGet(
      `/social/posts/search?q=${encodeURIComponent(searchQuery)}`,
      {
        limit,
        page: searchPage,
        _author: true,
        _reactions: true,
        sort: "created",
        sortOrder: "desc",
      }
    );

    searchData = [...searchData, ...newPosts];

    // Show "No results" message if searchData is empty
    if (searchData.length === 0) {
      postsContainer.innerHTML = `<div class="text-gray-500 text-center py-8 w-full">No posts found for "${searchQuery}".</div>`;
      loadMoreBtn.style.display = "none";
      return;
    }

    renderPosts(searchData, postsContainer, {
      containerLayout: "column",
      cardLayout: "responsive",
    });

    if (newPosts.length === limit) {
      loadMoreBtn.style.display = "block";
    } else {
      loadMoreBtn.style.display = "none";
    }

    searchPage++;
  } catch (err) {
    postsContainer.innerHTML = `<div class="text-red-600">Error loading search results.</div>`;
    loadMoreBtn.style.display = "none";
    console.error("Failed to fetch search posts:", err);
  } finally {
    searchIsLoading = false;
  }
}

// ---- SEARCH INPUT HANDLER ----
searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim();
  if (feedTitle) {
    feedTitle.textContent = searchQuery
      ? "Search Results"
      : tagFilter
      ? `Posts tagged #${tagFilter}`
      : "Latest Frontend Shitposting";
  }

  if (!searchQuery) {
    // Exit search mode, restore normal feed
    searchMode = false;
    searchData = [];
    searchPage = 1;
    postData = [];
    page = 1;
    fetchAndRenderPosts(loadMoreBtn);
    return;
  }
  // Enter search mode
  searchMode = true;
  searchData = [];
  searchPage = 1;
  fetchAndRenderSearch(loadMoreBtn);
});

// ---- LOAD MORE BUTTON HANDLER ----
loadMoreBtn.addEventListener("click", () => {
  if (searchMode) {
    fetchAndRenderSearch(loadMoreBtn);
  } else {
    fetchAndRenderPosts(loadMoreBtn);
  }
});

// ---- FILTER DROPDOWN HANDLER ----
if (filterDropdown) {
  filterDropdown.addEventListener("change", (e) => {
    // --- TAG FILTER  ---
    tagFilter = null;
    // Remove 'tag' from URL
    if (window.history && window.history.replaceState) {
      const url = new URL(window.location);
      url.searchParams.delete("tag");
      window.history.replaceState({}, "", url);
    }

    currentFilter = e.target.value;
    if (feedTitle) {
      const titles = {
        allPosts: "All Posts",
        fedsPosts: "Latest Frontend Shitposting",
        following: "Latest from your followers",
        yourPosts: "Your Posts",
      };
      feedTitle.textContent = titles[currentFilter] || "Feed";
      document.title = `FEDS feed | ${titles[currentFilter]}`;
    }
    postData = [];
    page = 1;
    fetchAndRenderPosts(loadMoreBtn);
  });
}

// ---- DOMContentLoaded ----
document.addEventListener("DOMContentLoaded", async () => {
  updateCount("content", "charCount");
  if (window.feather) feather.replace();

  // fetch current user
  const { name: currentUser } = await fetchCurrentUser();
  currentUserFilterUrl = `/social/profiles/${currentUser}/posts`;

  // setup for image preview in Modal
  const loadImageBtn = document.getElementById("loadImageBtn");
  const imageUrlInput = document.getElementById("imageUrl");
  const imagePreview = document.getElementById("imagePreview");
  if (loadImageBtn && imageUrlInput && imagePreview) {
    loadImageBtn.addEventListener("click", () => {
      const url = imageUrlInput.value.trim();
      imagePreview.innerHTML = ""; // Clear previous
      if (url) {
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

  // set up modal
  createModal({
    openButtonSelector: "#newPostBtn",
    modalId: "modal",
    closeButtonId: "closeModal",
    formId: "newPostForm",
    onSubmit: ({ form }) => {
      /* ... */
    },
  });

  // Initial feed load
  fetchAndRenderPosts(loadMoreBtn);
  addNewPostListener();
});
