import { checkLoginAndRoute, logout } from "./user/userChecks.js";
import { initScrollToTopButton } from "./ui/toTopBtn.js";

//Check if user is Logged in
checkLoginAndRoute();

// scrollbutton
initScrollToTopButton();

// Mobile menu toggle functionality
const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton.addEventListener("click", () => {
  navLinks.classList.toggle("hidden");
  navLinks.classList.toggle("flex");
  // No need to toggle flex-col, items-start, etc. if they're already in the default classes.
});

// Close mobile menu when clicking outside
document.addEventListener("click", (event) => {
  const isClickInsideMenu = navLinks.contains(event.target);
  const isClickOnButton = menuButton.contains(event.target);

  if (
    !isClickInsideMenu &&
    !isClickOnButton &&
    !navLinks.classList.contains("hidden")
  ) {
    menuButton.click();
  }
});

// check if returned from deleted post
if (sessionStorage.getItem("reloadOnBack")) {
  sessionStorage.removeItem("reloadOnBack");
  window.location.reload();
}

//logout
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", logout);
