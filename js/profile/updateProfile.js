import { PROFILES } from "../api/apiEndpoints.js";
import { apiPut } from "../api/putAPI.js";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../user/localStorage.js";

// Get the logged-in user data
const userData = getFromLocalStorage("profile");

/**
 * Attaches submit handler to the update profile form after modal is rendered
 */
export function profileUpdater(onSuccess) {
  const submitBtn = document.querySelector(
    "#updateProfileForm button[type='submit']"
  );
  const form = document.getElementById("updateProfileForm");

  if (!submitBtn || !form) return;

  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const bioInput = document.getElementById("bio");
    if (!bioInput) return;

    // Remove existing alert
    const oldAlert = form.querySelector(".inline-alert");
    if (oldAlert) oldAlert.remove();

    // Create a new inline alert
    const alertEl = document.createElement("div");
    alertEl.className = "inline-alert text-sm mt-2 p-2 rounded-md";
    form.appendChild(alertEl);

    try {
      const newBio = bioInput.value;

      // Update bio via API
      await apiPut(`${PROFILES}/${userData.name}`, { bio: newBio });

      // Update localStorage
      const profile = getFromLocalStorage("profile") || {};
      profile.bio = newBio;
      saveToLocalStorage("profile", profile);
      //display message
      alertEl.textContent = "Profile updated successfully.";
      alertEl.classList.add(
        "bg-green-100",
        "text-green-800",
        "border",
        "border-green-300"
      );
    } catch (error) {
      //display message
      alertEl.textContent = error.message || "Update failed.";
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
      const modal = document.getElementById("profileModal");
      modal.classList.add("hidden");
      window.location.reload(true);
    }, 1500);
  });
}
