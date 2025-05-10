export function displayErrorMessage(message) {
  // Create error message element if it doesn't exist
  let errorElement = document.getElementById("login-error");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.id = "login-error";
    errorElement.className = "text-red-600 text-sm mt-2";

    // Insert before the submit button
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.parentNode.insertBefore(errorElement, submitButton);
  }

  errorElement.textContent = message;
}

/**
 * Displays a notification to the user
 * @param {string} message - Notification message
 * @param {string} type - Notification type: 'info', 'success', 'error', 'warning'
 */
export function displayNotification(message, type = "info") {
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notificationMessage");

  // Set message
  notificationMessage.textContent = message;

  // Set color based on type
  notification.className =
    "fixed bottom-20 right-4 max-w-md transform transition-transform duration-300";

  switch (type) {
    case "success":
      notification.classList.add(
        "bg-green-200",
        "border-l-4",
        "border-green-600",
        "text-green-800"
      );
      break;
    case "error":
      notification.classList.add(
        "bg-red-200",
        "border-l-4",
        "border-red-600",
        "text-red-800"
      );
      break;
    case "warning":
      notification.classList.add(
        "bg-yellow-200",
        "border-l-4",
        "border-yellow-600",
        "text-yellow-800"
      );
      break;
    default:
      notification.classList.add(
        "bg-blue-200",
        "border-l-4",
        "border-blue-600",
        "text-blue-800"
      );
  }

  // Show notification
  notification.classList.remove("translate-y-full");

  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.add("translate-y-full");
  }, 3000);
}
