// Mobile menu toggle functionality
const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton.addEventListener("click", () => {
  navLinks.classList.toggle("hidden");
  navLinks.classList.toggle("flex");
  navLinks.classList.toggle("flex-col");
  navLinks.classList.toggle("absolute");
  navLinks.classList.toggle("top-16");
  navLinks.classList.toggle("left-0");
  navLinks.classList.toggle("right-0");
  navLinks.classList.toggle("bg-white");
  navLinks.classList.toggle("p-4");
  navLinks.classList.toggle("space-y-2");
  navLinks.classList.toggle("sm:space-y-0");
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
