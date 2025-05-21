import { API_BASE, API_AUTH, API_LOGIN } from "../api/apiEndpoints.js";
import { saveToLocalStorage } from "./localStorage.js";
import { validateEmail } from "./validateEmail.js";
import { displayNotification } from "../utility/displayUserNotifications.js";

const loginUrl = API_BASE + API_AUTH + API_LOGIN;

async function userLogin(url, userData) {
  try {
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };
    const response = await fetch(url, postData);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Login failed");
    }

    const { accessToken, ...profile } = json.data;
    saveToLocalStorage("profile", profile);
    saveToLocalStorage("accessToken", accessToken);

    displayNotification("Login was successful", "success");

    // Redirect to profile page after successful login
    setTimeout(() => {
      window.location.href = "/profile";
    }, 2000);

    return true;
  } catch (error) {
    console.log(error);
    // Display error message to user
    displayNotification(
      "Login failed. Please check your credentials and try again.",
      "error"
    );
    return false;
  }
}

function validatePassword(password) {
  return password.length >= 8;
}

function resetSubmitButton(button, originalText) {
  button.textContent = originalText;
  button.disabled = false;
}

// Wait for DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginForm = document.querySelector("form");

  // Handle form submission
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validate inputs
    if (!validateEmail(email)) {
      displayNotification("Please enter a valid email address.", "error");
      return;
    }

    if (!validatePassword(password)) {
      displayNotification(
        "Password must be at least 8 characters long.",
        "info"
      );
      return;
    }

    // Create user object from form data
    const userData = {
      email: email,
      password: password,
    };

    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Signing in...";
    submitButton.disabled = true;

    // Attempt login and handle result
    const loginSuccess = await userLogin(loginUrl, userData);

    // Reset button if login failed
    if (!loginSuccess) {
      resetSubmitButton(submitButton, originalButtonText);
    }
  });
});
