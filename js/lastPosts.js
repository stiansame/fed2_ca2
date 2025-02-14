// Import posts data
import { posts } from "./feed.js";

// DOM Elements
const postsContainer = document.getElementById("postsContainer");

// Filter and Render Posts
function renderBraxxtonPosts() {
  // Filter posts by Braxxxton
  const braxxtonPosts = posts.filter((post) => post.author === "Braxxxton");

  // Clear existing posts
  postsContainer.innerHTML = "";

  // Create a grid container with responsive columns
  postsContainer.className =
    "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  // Render each post
  braxxtonPosts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className =
      "bg-white p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:rotate-1";

    postElement.innerHTML = `
      <div class="space-y-4">
          <!-- Post Title -->
          <h3 class="text-xl font-bold text-gray-800">${post.title}</h3>
          
          <!-- Post Image -->
          <img src="${post.image}" alt="Post image" class="rounded-lg w-full object-cover">
          
          <!-- Post Content -->
          <p class="text-gray-700">${post.content}</p>
          
          <!-- Post Interactions -->
          <div class="flex items-center justify-between text-sm text-gray-600">
              <div class="flex items-center gap-2">
                  <i data-feather="heart"></i>
                  <span>${post.likes} likes</span>
              </div>
              <div class="flex items-center gap-2">
                  <i data-feather="message-circle"></i>
                  <span>${post.comments} comments</span>
              </div>
          </div>
      </div>
    `;

    postsContainer.appendChild(postElement);
  });

  // Replace feather icons
  feather.replace();
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", renderBraxxtonPosts);
