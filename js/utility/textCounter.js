export function updateCount(textareaId, counterId) {
  const textarea = document.getElementById(textareaId);
  const counter = document.getElementById(counterId);

  if (!textarea || !counter) return;

  counter.textContent = textarea.value.length;

  textarea.addEventListener("input", () => {
    counter.textContent = textarea.value.length;
  });
}
