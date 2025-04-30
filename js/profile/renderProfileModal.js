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
    avatar: {
      url = "../../api/images/profile/default_profile.jpg",
      alt = "Default Avatar",
    } = {},
  } = userData;

  console.log("proflieModal injected");

  // Return the profile modal HTML
  return `
    <!-- Update Profile Modal -->
    <div class="bg-white rounded-lg w-full max-w-lg mx-4">
        <div class="p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Update Profile</h2>
                <button id="closeProfileModal" class="text-gray-500 hover:text-gray-700">
                    <i data-feather="x" class="h-6 w-6"></i>
                </button>
            </div>
            <form id="updateProfileForm" class="space-y-4">
                <!-- Current Avatar -->
                <div class="flex flex-col items-center space-y-2">
                    <img id="currentAvatar" src="${url}" alt="${alt}" class="h-24 w-24 rounded-full object-cover">
                    <div id="profileDropZone" class="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 w-full">
                        <i data-feather="image" class="h-8 w-8 text-gray-400"></i>
                        <p class="text-sm text-gray-500">Click to upload new avatar or drag and drop</p>
                        <p class="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                        <label for="profileFileInput" class="sr-only">Upload new avatar</label>
                        <input type="file" id="profileFileInput" class="hidden" accept="image/*">
                        <button type="button" id="selectProfileImageBtn" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            Select New Avatar
                        </button>
                    </div>
                </div>

                <!-- Name (not editable) -->
                <div>
                    <label for="name" class="sr-only">Name</label>
                    <input type="text" id="name" value="${name}" class="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed" readonly>
                </div>

                <!-- Email (not editable) -->
                <div>
                    <label for="email" class="sr-only">Email</label>
                    <input type="email" id="email" value="${email}" class="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed" readonly>
                </div>

                <!-- Editable Bio -->
                <div>
                    <label for="bio" class="sr-only">Bio</label>
                    <textarea id="bio" placeholder="Write something about yourself..."
                        class="w-full h-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">${bio}</textarea>
                </div>

                <!-- Save Changes Button -->
                <button type="submit" class="w-full px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-900">
                    Save Changes
                </button>
            </form>
        </div>
    </div>
  `;
  createModal({
    openButtonId: "openProfileModalBtn",
    modalId: "profileModal",
    closeButtonId: "closeProfileModal",
  });
}

// Example usage:
// document.getElementById('modalContainer').innerHTML = renderProfileModal();
