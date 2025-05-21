export function initScrollToTopButton({
  scrollDistance = 300,
  buttonId = "scrollToTopBtn",
} = {}) {
  const scrollBtn = document.getElementById(buttonId);

  if (!scrollBtn) {
    console.warn(`Button with id "${buttonId}" not found.`);
    return;
  }

  // Show button after scrolling down `scrollDistance` px
  window.addEventListener("scroll", () => {
    if (window.scrollY > scrollDistance) {
      scrollBtn.classList.remove("opacity-0", "pointer-events-none");
      scrollBtn.classList.add("opacity-100");
    } else {
      scrollBtn.classList.add("opacity-0", "pointer-events-none");
      scrollBtn.classList.remove("opacity-100");
    }
  });

  // Smooth scroll to top
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Refresh Feather icons (optional if using feather)
  if (window.feather) window.feather.replace();
}
