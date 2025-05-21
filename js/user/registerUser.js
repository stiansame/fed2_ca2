import { API_BASE, API_REGISTER, API_AUTH } from "../api/apiEndpoints.js";
import { saveToLocalStorage } from "./localStorage.js";
import { validateEmail } from "./validateEmail.js";
import { displayNotification } from "../utility/displayUserNotifications.js";

const registerUrl = API_BASE + API_AUTH + API_REGISTER;

async function registerUser(url, userData) {
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
      const errorData = json.errors?.[0]?.message || "Registration failed";
      throw new Error(errorData);
    }

    const { accessToken, ...profile } = json.data;
    saveToLocalStorage("profile", profile);
    saveToLocalStorage("accessToken", accessToken);

    displayNotification("Registration was successful", "success");

    // Redirect to login page after successful registration
    setTimeout(() => {
      window.location.href = "../../";
    }, 2000);

    return true;
  } catch (error) {
    console.error(error);
    displayNotification(
      error.message ||
        "Registration failed. Please check the details and try again.",
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

document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const registerForm = document.querySelector("form");

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!username) {
      displayNotification("Please enter a username.", "info");
      return;
    }

    if (!validateEmail(email)) {
      displayNotification(
        "Please enter a valid email address. Must be @stud.noroff or @noroff domain",
        "error"
      );
      return;
    }

    if (!validatePassword(password)) {
      displayNotification(
        "Password must be at least 8 characters long.",
        "info"
      );
      return;
    }

    const userData = {
      name: username,
      email: email,
      password: password,
    };

    const submitButton = document.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Registering...";
    submitButton.disabled = true;

    const registrationSuccess = await registerUser(registerUrl, userData);

    if (!registrationSuccess) {
      resetSubmitButton(submitButton, originalButtonText);
    }
  });
});
