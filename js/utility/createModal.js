export function createModal({ openButtonId, modalId, closeButtonId }) {
  const openButton = document.getElementById(openButtonId);
  const modal = document.getElementById(modalId);
  const closeButton = document.getElementById(closeButtonId);

  if (!openButton || !modal || !closeButton) {
    console.warn(
      `Modal setup failed: Check IDs -> ${openButtonId}, ${modalId}, ${closeButtonId}`
    );
    return;
  }

  function openModal() {
    modal.classList.remove("hidden");
    document.addEventListener("keydown", handleEscClose); // Enable ESC close when modal opens
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.removeEventListener("keydown", handleEscClose); // Remove listener when modal closes
  }

  function handleEscClose(e) {
    if (e.key === "Escape") {
      closeModal();
    }
  }

  openButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Example usage
/* createModal({
  openButtonId: "openProfileModalBtn",
  modalId: "profileModal",
  closeButtonId: "closeProfileModal",
});
 */
