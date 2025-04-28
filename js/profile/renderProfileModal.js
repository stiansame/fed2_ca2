/**
 * Renders a profile modal HTML using data from API or local storage
 * @param {Object} userData - Optional user data object (if not provided, will be fetched)
 * @returns {string} HTML string for the modal
 */
export function renderProfileModal(userData = null) {
  // If no userData provided, try to get from localStorage
  if (!userData) {
    const storedData = localStorage.getItem("profile");
    if (storedData) {
      userData = JSON.parse(storedData);
    } else {
      // Default values if nothing is available
      userData = {
        name: "User",
        email: "user@example.com",
        bio: "",
        avatar: "../../api/images/profile/default_profile.jpg",
      };
    }
  }

  // Destructure user data with defaults
  const {
    name = "User",
    email = "user@example.com",
    bio = "",
    avatar = "../../api/images/profile/default_profile.jpg",
  } = userData;

  // Return the HTML string
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
                        <img id="currentAvatar" src="${avatar.url}" alt="${avatar.alt}" class="h-24 w-24 rounded-full object-cover">
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
}

// Example usage:
// 1. Render with default data from localStorage
// document.getElementById('modalContainer').innerHTML = renderProfileModal();

// 2. Render with data from API
// fetch('/api/user/profile')
//   .then(response => response.json())
//   .then(userData => {
//     document.getElementById('modalContainer').innerHTML = renderProfileModal(userData);
//     // Initialize feather icons
//     feather.replace();
//   });
