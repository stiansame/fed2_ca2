import { PROFILES } from "../api/apiEndpoints.js";
import { apiPut } from "../api/putAPI.js";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../user/localStorage.js";
import { displayNotification } from "../utility/displayUserNotifications.js"; // adjust path if needed

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
    const avatarInput = document.getElementById("avatarUrl");
    const bannerInput = document.getElementById("bannerUrl");

    if (!bioInput || !avatarInput || !bannerInput) return;

    try {
      const updatedProfile = {
        bio: bioInput.value,
        avatar: {
          url: avatarInput.value,
        },
        banner: {
          url: bannerInput.value,
        },
      };

      // Update bio via API
      await apiPut(`${PROFILES}/${userData.name}`, updatedProfile);

      // Update localStorage
      const profile = getFromLocalStorage("profile") || {};
      profile.bio = updatedProfile.bio;
      profile.avatar = updatedProfile.avatar;
      profile.banner = updatedProfile.banner;
      saveToLocalStorage("profile", profile);

      // Show success
      displayNotification("Profile updated successfully.", "success");
    } catch (error) {
      displayNotification(error.message || "Update failed.", "error");
    }

    // Close modal after 1.5s and reload
    setTimeout(() => {
      const modal = document.getElementById("profileModal");
      modal.classList.add("hidden");
      window.location.reload(true);
    }, 1500);
  });
}
