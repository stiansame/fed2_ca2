/**
 * Displays a notification to all elements with the class 'notification'
 * @param {string} message - Notification message
 * @param {string} type - Notification type: 'info', 'success', 'error', 'warning'
 */
export function displayNotification(message, type = "info") {
  const notifications = document.querySelectorAll(".notification");

  if (!notifications.length) return; // No notification elements found

  notifications.forEach((notification) => {
    // Clear any previous content/classes
    notification.className = "notification"; // preserve class for next time
    notification.textContent = "";

    // Set unified alert styling
    notification.classList.add(
      "inline-alert",
      "text-sm",
      "mt-2",
      "p-2",
      "rounded-md",
      "border"
    );

    // Color by type
    switch (type) {
      case "success":
        notification.classList.add(
          "bg-green-100",
          "text-green-800",
          "border-green-300"
        );
        break;
      case "error":
        notification.classList.add(
          "bg-red-100",
          "text-red-800",
          "border-red-300"
        );
        break;
      case "warning":
        notification.classList.add(
          "bg-yellow-100",
          "text-yellow-800",
          "border-yellow-300"
        );
        break;
      default:
        notification.classList.add(
          "bg-blue-100",
          "text-blue-800",
          "border-blue-300"
        );
    }

    notification.textContent = message;
    notification.style.display = "block";

    // Hide after 3 seconds
    setTimeout(() => {
      notification.textContent = "";
      notification.style.display = "none";
    }, 3000);
  });
}
