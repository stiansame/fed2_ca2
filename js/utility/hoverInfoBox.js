/**
 * Initialize and handle hover info-box for follower/following.
 *
 * @param {HTMLElement} targetElem - The DOM element to attach hover to.
 * @param {Array} usersArr - Array of user objects (must have 'name' or 'username' property).
 * @param {string} label - Label to display in info box ("Followers", "Following", etc).
 */

export function attachHoverInfoBox(targetElem, usersArr, label) {
  let infoBox = document.getElementById("hoverInfoBox");
  if (!infoBox) {
    infoBox = document.createElement("div");
    infoBox.id = "hoverInfoBox";
    infoBox.className = [
      "hidden absolute z-[9999]",
      "min-w-[180px] max-w-xs",
      "bg-black/75 text-white",
      "border-2 border-blue-600",
      "rounded-lg shadow-2xl",
      "px-4 py-2",
      "transition-all duration-150",
      "backdrop-blur-sm",
      "text-xs",
    ].join(" ");
    document.body.appendChild(infoBox);
  }

  function showInfoBox(e) {
    // Limit to 20 names, then ellipsis
    let displayArr = usersArr ? usersArr.slice(0, 20) : [];
    let overflow = usersArr && usersArr.length > 20;
    let innerHtml =
      `<div class="font-bold text-blue-400 mb-1">${label}</div>` +
      (displayArr.length
        ? displayArr
            .map(
              (u) =>
                `<div class="truncate font-medium hover:text-blue-200 cursor-default">${
                  u.name || u.username || "Unknown"
                }</div>`
            )
            .join("")
        : "<div class='text-gray-400 italic'>None found</div>") +
      (overflow ? `<div class="text-gray-400 italic">...and more</div>` : "") +
      `<div id="hoverInfoBoxPointer" class="absolute left-1/2 -top-2.5 -translate-x-1/2 w-4 h-4 z-[-1]"></div>`;

    infoBox.innerHTML = innerHtml;

    // Tooltip position
    const rect = targetElem.getBoundingClientRect();
    let left = e.clientX - 110;
    const maxLeft = window.innerWidth - 230;
    if (left > maxLeft) left = maxLeft;
    if (left < 10) left = 10;
    infoBox.style.left = `${left}px`;
    infoBox.style.top = `${rect.bottom + window.scrollY + 10}px`;
    infoBox.classList.remove("hidden");
    infoBox.style.opacity = 1;
  }

  function hideInfoBox() {
    infoBox.classList.add("hidden");
    infoBox.style.opacity = 0;
  }

  targetElem.addEventListener("mouseenter", showInfoBox);
  targetElem.addEventListener("mousemove", showInfoBox);
  targetElem.addEventListener("mouseleave", hideInfoBox);
}
