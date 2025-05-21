function createImageUploader(config) {
  const {
    inputId,
    previewId,
    dropZoneId,
    selectButtonId = null,
    resetButtonId = null,
    defaultImage = null,
    acceptedTypes = ["image/png", "image/jpeg"],
  } = config;

  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const dropZone = document.getElementById(dropZoneId);
  const selectButton = selectButtonId
    ? document.getElementById(selectButtonId)
    : null;
  const resetButton = resetButtonId
    ? document.getElementById(resetButtonId)
    : null;

  if (!input || !preview || !dropZone) {
    console.warn(
      "createImageUploader: One or more required elements not found."
    );
    return;
  }

  const originalSrc = defaultImage || preview.src;

  function updatePreview(file) {
    if (!acceptedTypes.includes(file.type)) {
      alert("Invalid file type. Only PNG or JPEG allowed.");
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  input.addEventListener("change", function () {
    const file = input.files[0];
    if (file) {
      updatePreview(file);
    }
  });

  if (selectButton) {
    selectButton.addEventListener("click", function () {
      input.click();
    });
  }

  // Drag and Drop Events
  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add("bg-gray-100");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove("bg-gray-100");
    });
  });

  dropZone.addEventListener("drop", function (e) {
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!acceptedTypes.includes(file.type)) {
        alert("Invalid file type dropped.");
        return;
      }
      updatePreview(file);

      // Manually update the input files for form submission
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
    }
  });

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      preview.src = originalSrc;
      input.value = ""; // Clear the file input
    });
  }
}
