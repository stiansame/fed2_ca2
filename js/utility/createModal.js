export function createModal({
  openButtonId,
  modalId,
  closeButtonId,
  formId,
  onSubmit,
}) {
  const openButton = document.getElementById(openButtonId);
  const modal = document.getElementById(modalId);
  const closeButton = document.getElementById(closeButtonId);
  const form = formId ? document.getElementById(formId) : null;

  if (!openButton || !modal || !closeButton) {
    console.warn(
      `Modal setup failed: Check IDs -> ${openButtonId}, ${modalId}, ${closeButtonId}`
    );
    return;
  }

  function openModal() {
    modal.classList.remove("hidden");
    document.addEventListener("keydown", handleEscClose);
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.removeEventListener("keydown", handleEscClose);
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

  if (form && typeof onSubmit === "function") {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        await onSubmit();
        window.location.reload();
        closeModal();
      } catch (error) {
        console.error("Modal form submission failed:", error);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
}

// Example usage
/* createModal({
  openButtonId: "openProfileModalBtn",
  modalId: "profileModal",
  closeButtonId: "closeProfileModal",
});
 */
