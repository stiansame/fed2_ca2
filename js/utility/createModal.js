/**
 * Sets up a modal dialog with open/close logic and optional form handling.
 *
 * @param {Object} options - Modal setup options.
 * @param {string} options.openButtonSelector - CSS selector or ID (#id) for button(s) that open the modal.
 * @param {string} options.modalId - The ID of the modal element to display.
 * @param {string} options.closeButtonId - The ID of the button that closes the modal.
 *@param {string} [options.modalContentId="modalContent"] - Content wrapper ID (default: "modalContent")

 * @param {string} [options.formId] - Optional. The ID of a form inside the modal, if you want to handle form submission.
 * @param {function} [options.onSubmit] - Optional. Async function called when the form submits. Should throw on error.
 * @param {function} [options.onOpen] - Optional. Function called when the modal is opened. Receives (triggerBtn, modalElem).
 *
 * @returns {void}
 *
 * @example
 * // Simple modal without form
 * createModal({
 *   openButtonSelector: '#openModalBtn',
 *   modalId: 'modal',
 *   closeButtonId: 'modalClose'
 * });
 */

import { deletePost } from "../posts/apiService.js";
import { getUrlParam } from "./urlHandler.js";
import { displayNotification } from "./displayUserNotifications.js";

export function createModal({
  openButtonSelector, // can be a selector string (class, attribute, or #id)
  modalId,
  closeButtonId,
  formId,
  onSubmit,
  onOpen,
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
    openButtons = Array.from(document.querySelectorAll(openButtonSelector));
  }

  const modal = document.getElementById(modalId);
  const modalContent = modal.querySelector(".modal-content");
  const closeButton = document.getElementById(closeButtonId);
  const form = formId ? document.getElementById(formId) : null;

  /*   if (!openButtons.length || !modal || !closeButton) {
    console.warn(
      `Modal setup failed: Check selectors -> ${openButtonSelector}, ${modalId}, ${closeButtonId}`
    );
    return;
  } */

  // Set ARIA attributes
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  function openModal(e) {
    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.classList.add("opacity-100", "pointer-events-auto");
    modalContent.classList.remove("scale-95", "opacity-0");
    modalContent.classList.add("scale-100", "opacity-100");
    document.addEventListener("keydown", handleEscClose);
    // Optionally handle data attributes from the trigger button
    if (typeof onOpen === "function") {
      onOpen(e.currentTarget, modal);
    }
  }

  function closeModal() {
    modal.classList.remove("opacity-100", "pointer-events-auto");
    modal.classList.add("opacity-0", "pointer-events-none");
    modalContent.classList.remove("scale-100", "opacity-100");
    modalContent.classList.add("scale-95", "opacity-0");
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

  //deletebutton listener
  modal.addEventListener("click", (e) => {
    if (form && e.target.matches("#deletePostBtn")) {
      const postId = getUrlParam("id");
      if (confirm("Are you sure you want to delete this post?")) {
        closeModal();
        //call delete function
        deletePost(postId);

        //Display Info
        setTimeout(() => {
          displayNotification("Post deleted", "warning");
        }, 1500);
      }

      //Go back to previous page and reload
      sessionStorage.setItem("reloadOnBack", "true");
      setTimeout(() => {
        window.history.back();
      }, 3000);
    }
  });

  if (form && typeof onSubmit === "function") {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        await onSubmit();

        // Wait 2 seconds, then close the modal and clear the message
        setTimeout(() => {
          closeModal();
        }, 2000);
      } catch (error) {
        displayNotification("Oh no! Something Happened! Try again", "error");
        console.error("Modal form submission failed:", error);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
}
