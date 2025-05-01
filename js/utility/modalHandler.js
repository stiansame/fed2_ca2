/**
 * Create a reusable modal with image URL functionality
 * @param {Object} config - Configuration object
 * @param {string} config.openButtonId - Button that opens the modal
 * @param {string} config.modalId - Modal container
 * @param {string} config.closeButtonId - Button that closes the modal
 * @param {string} config.formId - Form inside the modal
 * @param {Object} config.image - Image configuration (optional)
 * @param {string} config.image.inputId - URL input element
 * @param {string} config.image.previewId - Container to preview the image
 * @param {Function} config.onSubmit - Custom submit handler
 * @returns {Object} - Modal control object
 */
export function createModal({
  openButtonId,
  modalId,
  closeButtonId,
  formId,
  image,
  onSubmit,
}) {
  // Get DOM elements
  const modal = document.getElementById(modalId);
  const openButton = document.getElementById(openButtonId);
  const closeButton = document.getElementById(closeButtonId);
  const form = document.getElementById(formId);

  // Image state
  let imageUrl = null;

  // Set up image URL handling if configured
  if (image) {
    const urlInput = document.getElementById(image.inputId);
    const previewContainer = document.getElementById(image.previewId);

    // Function to handle image URL preview
    function handleImageUrl(url) {
      if (!url) return;

      // Clear previous preview
      clearImagePreview();

      // Show loading state
      previewContainer.innerHTML =
        '<div class="flex items-center justify-center p-4"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div></div>';

      // Create and load image
      const img = new Image();
      img.onload = () => {
        imageUrl = url;
        displayImagePreview(url);
      };

      img.onerror = () => {
        previewContainer.innerHTML =
          '<div class="text-red-500 text-center p-2">Invalid image URL</div>';
        imageUrl = null;
      };

      img.src = url;
    }

    // Function to display image preview
    function displayImagePreview(url) {
      previewContainer.innerHTML = `
        <div class="relative">
          <img src="${url}" alt="Preview" class="w-full h-48 object-cover rounded-md">
          <button type="button" id="removeImageBtn" class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      `;

      // Add event listener to delete button
      document
        .getElementById("removeImageBtn")
        .addEventListener("click", clearImagePreview);
    }

    // Function to clear image preview
    function clearImagePreview() {
      previewContainer.innerHTML = "";
      imageUrl = null;
      urlInput.value = "";
    }

    // URL input handlers (with null check)
    if (urlInput) {
      // Handle input event for real-time preview as user types
      urlInput.addEventListener(
        "input",
        debounce((e) => {
          const url = e.target.value.trim();
          if (url) {
            handleImageUrl(url);
          } else {
            clearImagePreview();
          }
        }, 500)
      ); // 500ms debounce to avoid excessive image loading

      // Also handle blur for when user tabs out or clicks elsewhere
      urlInput.addEventListener("blur", (e) => {
        const url = e.target.value.trim();
        if (url) {
          handleImageUrl(url);
        }
      });
    }

    // Simple debounce function to limit how often the handler runs
    function debounce(func, wait) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }

    // Optionally add a "Preview" button if desired
    // const previewBtn = document.getElementById("previewImageBtn");
    // if (previewBtn) {
    //   previewBtn.addEventListener("click", () => {
    //     const url = urlInput.value.trim();
    //     if (url) handleImageUrl(url);
    //   });
    // }
  }

  // Modal open/close functions
  function openModal() {
    modal.classList.remove("hidden");
    document.addEventListener("keydown", handleEscKey);
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.removeEventListener("keydown", handleEscKey);
  }

  function handleEscKey(e) {
    if (e.key === "Escape") closeModal();
  }

  // Event listeners
  openButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => e.target === modal && closeModal());

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit({ imageUrl, form });
    }

    closeModal();
  });

  // Return API
  return {
    open: openModal,
    close: closeModal,
    getImageUrl: () => imageUrl,
  };
}

// Example usage:
/*
const postModal = createModal({
  openButtonId: "newPostBtn",
  modalId: "modal",
  closeButtonId: "closeModal",
  formId: "newPostForm",
  image: {
    inputId: "imageUrlInput",
    previewId: "imagePreview"
  },
  onSubmit: ({ imageUrl, form }) => {
    const title = form.querySelector("#title").value;
    const content = form.querySelector("#content").value;
    const tags = Array.from(form.querySelector("#tags").value.split(','))
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    savePost({ title, content, imageUrl, tags });
  }
});
*/
