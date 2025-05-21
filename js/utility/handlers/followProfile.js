import { apiPut } from "../../api/putAPI.js";
import { refreshAll } from "./refreshAll.js";
import { fetchProfileData } from "../../posts/apiService.js";

/**
 *
 * @param {string} name - Username from profile of CurentUser
 * @param {array} followers - array of followers from CurrenUser Profile
 * @returns - True or false
 */

//Get currentUSer follow-state
export function followState(name, followers) {
  return followers.some((f) => f.name === name);
}

//Follow/unfollow from Profile and set followstate in DOM

export async function setupFollowButton({
  btnId,
  profileName,
  userName,
  followersArray,
  onFollowChange,
  endpoints = {
    follow: `/social/profiles/${profileName}/follow`,
    unfollow: `/social/profiles/${profileName}/unfollow`,
  },
}) {
  const followBtn = document.getElementById(btnId);

  if (!followBtn) return;

  let following = followState(userName, followersArray);

  function setBtnFollow() {
    followBtn.className =
      "w-28 bg-white hover:bg-blue-50 border border-blue-700 text-blue-700 rounded-md flex items-center gap-1 px-3 py-1 transition-colors duration-200";
    followBtn.innerHTML = `<i data-feather="user-plus" class="h-4 w-4"></i><span>Follow</span>`;
    if (window.feather) feather.replace();
  }

  function setBtnFollowing() {
    followBtn.className =
      "w-28 bg-blue-50 hover:bg-red-50 border border-blue-700 text-blue-700 rounded-md flex items-center gap-1 px-3 py-1 transition-colors duration-200";
    followBtn.innerHTML = `<i data-feather="user-check" class="h-4 w-4"></i><span>Following</span>`;
    if (window.feather) feather.replace();
  }

  function setBtnUnfollow() {
    followBtn.className =
      "w-28 bg-red-50 border border-blue-700 text-blue-700 rounded-md flex items-center gap-1 px-3 py-1 transition-colors duration-200";
    followBtn.innerHTML = `<i data-feather="user-minus" class="h-4 w-4"></i><span>Unfollow</span>`;
    if (window.feather) feather.replace();
  }

  function setLoading() {
    followBtn.disabled = true;
    followBtn.innerHTML = `<span>Please wait...</span>`;
  }

  // Initial render
  following ? setBtnFollowing() : setBtnFollow();

  // remove follow button for own profile
  if (userName === profileName) {
    followBtn.classList.add("hidden");
  } else {
    followBtn.classList.remove("hidden");
  }

  // Hover events for "Following" -> "Unfollow"
  followBtn.addEventListener("mouseenter", () => {
    if (following) setBtnUnfollow();
  });
  followBtn.addEventListener("mouseleave", () => {
    if (following) setBtnFollowing();
  });

  // Click toggles follow/unfollow
  followBtn.addEventListener("click", async () => {
    setLoading();
    const action = following ? "unfollow" : "follow";
    const url = endpoints[action];

    try {
      await apiPut(url);
      following = !following;
      following ? setBtnFollowing() : setBtnFollow();

      if (onFollowChange) {
        await onFollowChange();
      }
    } catch (error) {
      console.error("Something went wrong", error);
      following ? setBtnFollowing() : setBtnFollow();
    }
    followBtn.disabled = false;
  });
}
