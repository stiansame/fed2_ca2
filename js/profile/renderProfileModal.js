/**
 * Renders a profile modal HTML using data from localStorage
 * @returns {string} HTML string for the modal
 */
export function renderProfileModal() {
  // Fetch user data from localStorage
  const storedData = localStorage.getItem("profile");

  // If no data is found in localStorage, display an error
  if (!storedData) {
    return `
      <div class="bg-white rounded-lg w-full max-w-lg mx-4 p-6">
          <div class="text-center">
              <h2 class="text-xl font-semibold text-red-600">Error: No Profile Data Found</h2>
              <p class="text-gray-500 mt-2">Please log in to access your profile.</p>
          </div>
      </div>
    `;
  }

  // Parse the user data from localStorage
  const userData = JSON.parse(storedData);

  // Destructure user data with defaults
  const {
    name = "User",
    email = "user@example.com",
    bio = "",
    avatar = {},
    banner = {},
  } = userData ?? {};

  const { url: avatarUrl = "", alt: avatarAlt = "Default Avatar" } = avatar;

  const { url: bannerUrl = "", alt: bannerAlt = "default Banner" } = banner;

  console.log("proflieModal injected");
  console.log(userData);

  return userData;
}
