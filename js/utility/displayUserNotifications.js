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
