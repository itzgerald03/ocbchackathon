const colorModeSelect = document.getElementById("colorModeSelect");
const logoutBtn = document.getElementById("logoutBtn");

// Apply saved color blindness mode on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedMode = localStorage.getItem("colorBlindMode") || "default";
  colorModeSelect.value = savedMode;
  applyColorMode(savedMode);
});

// Function to apply the selected color mode
function applyColorMode(mode) {
  const filter = mode === "default" ? "none" : `url(#${mode})`;
  document.body.style.filter = filter;
}

// Save the selected color mode when it changes
colorModeSelect.addEventListener("change", () => {
  const selectedMode = colorModeSelect.value;
  applyColorMode(selectedMode);
  localStorage.setItem("colorBlindMode", selectedMode);
});

// Logout functionality
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});
