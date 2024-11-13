// Apply saved color blindness mode on page load
window.addEventListener("DOMContentLoaded", () => {
    const savedMode = localStorage.getItem("colorBlindMode") || "default";
    applyColorMode(savedMode);
  });
  
  // Function to apply the selected color mode
  function applyColorMode(mode) {
    const filter = mode === "default" ? "none" : `url(#${mode})`;
    document.body.style.filter = filter;
  }
  