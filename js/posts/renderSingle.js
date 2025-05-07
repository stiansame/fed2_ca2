import { apiGet } from "../api/getAPI.js";
import { createModal } from "../utility/createModal.js";
import { PROFILES } from "../api/apiEndpoints.js";

// Initialize Feather icons
feather.replace();

// Get post ID from URL
function getPostIdFromUrl() {
  const urlParams = new URLSearchParams(document.location.search);
  return urlParams.get("id");
}

// Global post data
let postData = null;
let comments = [];
let currentUser = null;
let followerCount = null;

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Feather icons
  feather.replace();

  // Get post ID from URL
  const postId = getPostIdFromUrl();

  fetchPost(postId);
});

// Fetch single post
async function fetchPost(postId) {
  try {
    const response = await apiGet(`/social/posts/${postId}`, {
      _author: true,
      _comments: true,
      _reactions: true,
    });

    postData = response.data;
    const postProfile = postData.author.name;

    // First get profile data
    await getProfileData(postProfile);

    // Then create the post card (with profile data now available)
    const container = document.getElementById("singlePostDiv");
    container.innerHTML = "";
    container.appendChild(createPostCard(postData));
    feather.replace();
  } catch (error) {
    console.error("Failed to fetch post:", error);
  }
}

function createPostCard(postData) {
  const {
    title = "Untitled Post",
    body: content = "No content.",
    created = "",
    media = {},
    author = {},
    tags = [],
    _count = {},
  } = postData;

  const imageUrl = media.url || "/api/images/posts/fallback.jpg";
  const imageAlt = media.alt || "Post image";
  const authorName = author.name || "Unknown Author";
  const avatarUrl = author.avatar?.url || "";
  const avatarAlt = author.avatar?.alt || "Author avatar";

  const postDate = new Date(created).toLocaleDateString();

  // Root container
  const card = document.createElement("div");
  card.className =
    "bg-white rounded-lg shadow-md overflow-hidden mb-8 transform duration-300 hover:shadow-lg";

  // Image section
  const imgWrapper = document.createElement("div");
  imgWrapper.className = "w-full";

  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = imageAlt;
  img.className = "w-full h-auto object-cover";
  imgWrapper.appendChild(img);

  // Content wrapper
  const contentWrapper = document.createElement("div");
  contentWrapper.className = "p-6";

  // Title
  const titleEl = document.createElement("h1");
  titleEl.className = "text-2xl font-bold mb-2";
  titleEl.textContent = title;

  // Date
  const dateEl = document.createElement("p");
  dateEl.className = "text-sm text-gray-500 mb-3";
  dateEl.textContent = `Posted on ${postDate}`;

  // Author section
  const authorSection = document.createElement("div");
  authorSection.className = "flex items-center space-x-3 mb-4 pb-3 border-b";

  const avatarWrapper = document.createElement("div");
  avatarWrapper.className =
    "h-10 w-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center";

  if (avatarUrl) {
    const avatarImg = document.createElement("img");
    avatarImg.src = avatarUrl;
    avatarImg.alt = avatarAlt;
    avatarImg.className = "h-full w-full object-cover";
    avatarWrapper.appendChild(avatarImg);
  } else {
    const defaultIcon = document.createElement("i");
    defaultIcon.setAttribute("data-feather", "user");
    defaultIcon.className = "h-6 w-6 text-blue-700";
    avatarWrapper.appendChild(defaultIcon);
  }

  const authorInfo = document.createElement("div");

  const authorNameEl = document.createElement("h3");
  authorNameEl.className = "font-medium";
  authorNameEl.textContent = authorName;

  const followersEl = document.createElement("div");
  followersEl.className = "text-sm text-gray-600";
  followersEl.textContent = `${followerCount} Followers`;

  authorInfo.appendChild(authorNameEl);
  authorInfo.appendChild(followersEl);

  const followBtn = document.createElement("button");
  followBtn.className =
    "ml-auto px-3 py-1 border border-blue-700 text-blue-700 rounded-md hover:bg-blue-50 flex items-center gap-1";
  followBtn.innerHTML = `<i data-feather="user-plus" class="h-3 w-3"></i><span>Follow</span>`;

  authorSection.appendChild(avatarWrapper);
  authorSection.appendChild(authorInfo);
  authorSection.appendChild(followBtn);

  // Body
  const bodyEl = document.createElement("div");
  bodyEl.className = "mb-4 text-gray-800 whitespace-pre-line";
  bodyEl.textContent = content;

  // Tags
  const tagsWrapper = document.createElement("div");
  tagsWrapper.className = "mb-4 flex flex-wrap gap-2";

  tags.forEach((tag) => {
    const tagEl = document.createElement("a");
    tagEl.href = `/tags/${tag}`;
    tagEl.className =
      "px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-full hover:bg-gray-300 transition-colors";
    tagEl.textContent = `#${tag}`;
    tagsWrapper.appendChild(tagEl);
  });

  // Footer / Actions
  const footer = document.createElement("div");
  footer.className = "p-4 border-t mt-auto flex justify-between items-center";

  const actions = document.createElement("div");
  actions.className = "flex gap-4";

  const likeCount = _count.reactions || 0;
  const likeBtn = document.createElement("button");
  likeBtn.className =
    "flex items-center gap-1 text-gray-600 hover:text-gray-800";
  likeBtn.innerHTML = `
  <i data-feather="heart" class="h-4 w-4"></i>
  <span>${likeCount}</span>
`;

  const commentCount = _count.comments || 0;
  const commentBtn = document.createElement("button");
  commentBtn.className =
    "flex items-center gap-1 text-gray-600 hover:text-gray-800";
  commentBtn.innerHTML = `
  <i data-feather="message-circle" class="h-4 w-4"></i>
  <span>${commentCount}</span>
`;

  actions.appendChild(likeBtn);
  actions.appendChild(commentBtn);

  const editBtn = document.createElement("button");
  editBtn.className =
    "px-3 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-900 flex items-center gap-1";
  editBtn.innerHTML = `<i data-feather="edit-2" class="h-3 w-3"></i><span>Edit</span>`;

  footer.appendChild(actions);
  footer.appendChild(editBtn);

  // Assemble all
  contentWrapper.appendChild(titleEl);
  contentWrapper.appendChild(dateEl);
  contentWrapper.appendChild(authorSection);
  contentWrapper.appendChild(bodyEl);
  contentWrapper.appendChild(tagsWrapper);
  contentWrapper.appendChild(footer);

  card.appendChild(imgWrapper);
  card.appendChild(contentWrapper);

  return card;
}

async function getProfileData(postProfile) {
  try {
    const response = await apiGet(`${PROFILES}/${postProfile}`, {
      _followers: true,
    });

    // Store profile data
    const profileData = response.data;
    followerCount = profileData._count?.followers || 0;

    return profileData;
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    followerCount = 0;
    return null;
  }
}
