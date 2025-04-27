//store to localStorage
export function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

//retrieve from localstorage
export function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
