// Select elements
const colorModeSelect = document.getElementById("colorModeSelect");
const startRecognitionButton = document.getElementById("startRecognition");
const output = document.getElementById("output");
const userBalanceElement = document.getElementById("userBalance");
const helpModal = document.getElementById("helpModal");
const closeModal = document.querySelector(".close");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Initialize SpeechRecognition
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = true; // Enable interim results for live transcription
recognition.maxAlternatives = 1;

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

// Save color blindness mode on change
colorModeSelect.addEventListener("change", () => {
  const selectedMode = colorModeSelect.value;
  applyColorMode(selectedMode);
  localStorage.setItem("colorBlindMode", selectedMode);
});

// Commands
const commands = {
  balance: () => {
    const balance = userBalanceElement.textContent.trim();
    speak(`Your current balance is ${balance}`);
    output.textContent = `Your balance is ${balance}`;
  },
  help: () => {
    speak("Available commands are: 'check balance', 'transfer funds', 'navigate home', and 'help'.");
    helpModal.style.display = "block";
    output.textContent = "Help command executed. Available commands listed.";
  },
};

// Start voice recognition with live transcription
startRecognitionButton.addEventListener("click", () => {
  output.textContent = "Listening...";
  recognition.start();
});

// Handle recognition results with live transcription
recognition.addEventListener("result", (event) => {
  // Live transcription of interim results
  const transcriptArray = Array.from(event.results)
    .map((result) => result[0].transcript)
    .join("");

  // Update output with live transcription
  output.textContent = `You said: "${transcriptArray}"`;

  // Process the command if the result is finalized
  if (event.results[event.results.length - 1].isFinal) {
    const spokenText = transcriptArray.toLowerCase();
    const matchedCommand = Object.keys(commands).find((cmd) =>
      spokenText.includes(cmd)
    );

    if (matchedCommand) {
      commands[matchedCommand]();
    } else {
      speak("Sorry, I didn't understand that command. Please try again.");
      output.textContent = "Unrecognized command. Try 'help' for a list of commands.";
    }
  }
});

// Close modal logic
closeModal.addEventListener("click", () => (helpModal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === helpModal) helpModal.style.display = "none";
});

// Speak response using Web Speech API
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}
