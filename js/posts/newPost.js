import { apiPost } from "../api/postAPI.js";
import { POSTS } from "../api/apiEndpoints.js";
import { sanitizeHtml } from "../utility/sanitizer.js";

export function newPost() {
  const postBtn = document.getElementById("submitPostBtn");

  const form = document.getElementById("newPostForm");

  postBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const postTitle = document.getElementById("title");
    const postContent = document.getElementById("content");
    const postTags = document.getElementById("tags");
    const postImageurl = document.getElementById("imageUrl");

    // Remove existing alert
    const oldAlert = form.querySelector(".inline-alert");
    if (oldAlert) oldAlert.remove();

    // Create a new inline alert
    const alertEl = document.createElement("div");
    alertEl.className = "inline-alert text-sm mt-2 p-2 rounded-md";
    form.appendChild(alertEl);

    try {
      // Sanitize and convert < and > to HTML entities
      const sanitizedTitle = sanitizeHtml(postTitle.value);
      const sanitizedContent = sanitizeHtml(postContent.value);

      // Make post content into an object and attach feds-tag
      const newPost = {
        title: sanitizedTitle,
        body: sanitizedContent,
        tags: [
          ...new Set(
            postTags.value
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
              .concat("feds")
          ),
        ],
        media: {
          url: postImageurl.value.trim(),
          alt: `image for ${sanitizedTitle}`,
        },
      };

      // Post it
      await apiPost(`${POSTS}`, newPost);

      //display message
      alertEl.textContent = "You posted successfully!";
      alertEl.classList.add(
        "bg-green-100",
        "text-green-800",
        "border",
        "border-green-300"
      );
    } catch (error) {
      //display message
      alertEl.textContent = error.message || "Post failed.";
      alertEl.classList.add(
        "bg-red-100",
        "text-red-800",
        "border",
        "border-red-300"
      );
    }
    //remove message and close modal
    setTimeout(() => {
      alertEl.remove();
      const modal = document.getElementById("modal");
      modal.classList.add("hidden");
      window.location.reload(true);
    }, 1500);
  });
}
