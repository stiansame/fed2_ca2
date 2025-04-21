function initializeModal() {
  const modal = document.getElementById("modal");
  const newPostBtn = document.getElementById("newPostBtn");
  const closeModal = document.getElementById("closeModal");
  const fileInput = document.getElementById("fileInput");
  const selectImageBtn = document.getElementById("selectImageBtn");
  const dropZone = document.getElementById("dropZone");
  const newPostForm = document.getElementById("newPostForm");

  if (!modal || !newPostBtn || !closeModal) return;

  newPostBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeModal.addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener(
    "click",
    (e) => e.target === modal && modal.classList.add("hidden")
  );

  if (selectImageBtn && fileInput) {
    selectImageBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) =>
      console.log("File selected:", e.target.files[0]?.name)
    );
  }

  if (dropZone) {
    ["dragover", "dragleave", "drop"].forEach((event) =>
      dropZone.addEventListener(event, (e) => {
        e.preventDefault();
        dropZone.classList.toggle("border-blue-500", event === "dragover");
        if (event === "drop")
          console.log("File dropped:", e.dataTransfer.files[0]?.name);
      })
    );
  }

  newPostForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    modal.classList.add("hidden");
  });
}

initializeModal();
