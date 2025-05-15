export function createModal({
  openButtonSelector, // can be a selector string (class, attribute, or #id)
  modalId,
  closeButtonId,
  formId,
  onSubmit,
  onOpen, // Optional: callback when modal opens, gets the trigger button as argument
}) {
  if (!openButtonSelector || typeof openButtonSelector !== "string") {
    console.warn("createModal: Missing or invalid openButtonSelector.");
    return;
  }

  let openButtons;

  // Support both ID (legacy) and selector use
  if (openButtonSelector.startsWith("#")) {
    const btn = document.getElementById(openButtonSelector.slice(1));
    openButtons = btn ? [btn] : [];
  } else {
    openButtons = document.querySelectorAll(openButtonSelector);
  }

  const modal = document.getElementById(modalId);
  const closeButton = document.getElementById(closeButtonId);
  const form = formId ? document.getElementById(formId) : null;

  if (!openButtons.length || !modal || !closeButton) {
    console.warn(
      `Modal setup failed: Check selectors -> ${openButtonSelector}, ${modalId}, ${closeButtonId}`
    );
    return;
  }

  function openModal(e) {
    modal.classList.remove("hidden");
    document.addEventListener("keydown", handleEscClose);
    // Optionally handle data attributes from the trigger button
    if (typeof onOpen === "function") {
      onOpen(e.currentTarget, modal);
    }
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

  openButtons.forEach((btn) => btn.addEventListener("click", openModal));
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

        closeModal();
      } catch (error) {
        console.error("Modal form submission failed:", error);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
}

// --- Example usage for comments/replies ---

/* 
createModal({
  openButtonSelector: '.reply-btn[data-comment-id]',
  modalId: 'commentReplyModal',
  closeButtonId: 'closeReplyModal',
  formId: 'replyForm',
  onOpen: (btn, modal) => {
    // Optional: update modal content based on which button was clicked
    const commentId = btn.dataset.commentId;
    // For example, fill a hidden input in the form:
    const input = modal.querySelector('input[name="commentId"]');
    if (input) input.value = commentId;
    // Or display commentId somewhere:
    const display = modal.querySelector('.comment-id-display');
    if (display) display.textContent = `Replying to comment #${commentId}`;
  },
  onSubmit: async () => {
    // Your submit logic here (e.g., AJAX request)
    // Don't forget to use the commentId from the form if needed!
  },
});
*/
