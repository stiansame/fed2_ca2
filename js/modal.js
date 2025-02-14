// Modal handling
function initializeModal() {
  const modal = document.getElementById("modal");
  const newPostBtn = document.getElementById("newPostBtn");
  const closeModal = document.getElementById("closeModal");
  const fileInput = document.getElementById("fileInput");
  const selectImageBtn = document.getElementById("selectImageBtn");
  const dropZone = document.getElementById("dropZone");
  const newPostForm = document.getElementById("newPostForm");

  // Guard clause if modal elements don't exist
  if (!modal || !newPostBtn || !closeModal) return;

  newPostBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // File upload handling
  if (selectImageBtn && fileInput && dropZone) {
    selectImageBtn.addEventListener("click", () => {
      fileInput.click();
    });

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("border-blue-500");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("border-blue-500");
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("border-blue-500");
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFile(file);
      }
    });

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFile(file);
      }
    });
  }

  if (newPostForm) {
    newPostForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Handle form submission logic here
      modal.classList.add("hidden");
    });
  }
}

function handleFile(file) {
  // Handle file upload logic here
  console.log("File selected:", file.name);
}

initializeModal();
