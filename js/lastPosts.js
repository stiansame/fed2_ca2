// Import posts data
import { posts } from "./decrapated/feed_old.js";

// Initialize Feather icons
feather.replace();

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
      "bg-white p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-103 hover:rotate-1";

    postElement.innerHTML = `
      <div class="flex flex-col space-y-4 h-full">
          <!-- Post Title -->
          <h3 class="text-xl font-bold text-gray-800">${post.title}</h3>
          
          <!-- Post Image -->
          <img src="${post.image}" alt="${post.title}" class="rounded-lg w-full object-cover">
          
          <!-- Post Content -->
          <p class="text-gray-700 whitespace-pre-line flex-1">${post.content}</p>
          
          <!-- Post Interactions -->
          <div class="flex justify-between items-center mt-auto">
                      <div class="flex gap-4">
                          <button class="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                              <i data-feather="heart" class="h-4 w-4"></i>
                              ${post.likes}
                          </button>
                          <button class="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                              <i data-feather="message-circle" class="h-4 w-4"></i>
                              ${post.comments}
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
    `;

    postsContainer.appendChild(postElement);
  });

  // Reinitialize Feather icons
  feather.replace();

  // FOR FUTURE REFERENCE - Add click event listeners to buttons
  const buttons = postsContainer.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      console.log("Button clicked", e.currentTarget);
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  renderBraxxtonPosts();
});
