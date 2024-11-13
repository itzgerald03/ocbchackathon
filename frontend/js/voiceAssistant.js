document.addEventListener("DOMContentLoaded", function () {
    // Select elements for Speech Recognition
    const output = document.getElementById("output"); // This will show speech output in modal
    const userBalanceElement = document.getElementById("balance");
    const transcriptionModal = document.getElementById("transcriptionModal"); // The transcription modal
    const closeModalButton = document.querySelector(".close"); // Close button for the modal

    // Ensure output element exists
    if (!output) {
        console.error("Output element not found!");
        return; // Exit if output element is missing
    }

    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false; // Disable interim results to avoid showing incomplete words
    recognition.maxAlternatives = 1;

    // Initialize speech synthesis for bot response
    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }

    // Commands for voice recognition
    const commands = {
        balance: () => {
            const balance = userBalanceElement.textContent.trim();
            const response = `Your current balance is ${balance}`;
            speak(response);
            appendToModal(response, 'bot'); // Display bot response
            askIfWantMoreQuestions(); // Ask if the user wants more questions
        },
        help: () => {
            const response = "Available commands are: 'check balance', 'navigate home', and 'help'.";
            speak(response);
            appendToModal(response, 'bot'); // Display bot response
            askIfWantMoreQuestions(); // Ask if the user wants more questions
        },
        home: () => {
            const response = "Navigating to the home page.";
            speak(response);
            appendToModal(response, 'bot'); // Display bot response
            window.location.href = "dashboard.html";
        },

        transfer: () => {
            const response = "Navigating to the Transfer Page.";
            speak(response);
            appendToModal(response, 'bot'); // Display bot response
            window.location.href = "transfer.html"; // Redirect to Transfer page
        }
    };

    // Start voice recognition
    function startRecognition() {
        output.textContent = "Listening...";

        // Show the transcription modal
        transcriptionModal.style.display = "block";

        recognition.start();
    }

    // Handle recognition results with live transcription
    recognition.addEventListener("result", (event) => {
        const transcriptArray = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");

        // Display live transcription
        appendToModal(`You said: "${transcriptArray}"`, 'user');

        // Process the command if the result is finalized
        if (event.results[event.results.length - 1].isFinal) {
            const spokenText = transcriptArray.toLowerCase();
            const matchedCommand = Object.keys(commands).find((cmd) =>
                spokenText.includes(cmd)
            );

            if (matchedCommand) {
                commands[matchedCommand]();
            } else {
                const response = "Sorry, I didn't understand that command. Please try again.";
                speak(response);
                appendToModal(response, 'bot'); // Display bot response
                askIfWantMoreQuestions(); // Ask if the user wants more questions
            }
        }
    });

    // Append both user and bot messages to the modal
    function appendToModal(message, sender) {
        const messageElement = document.createElement("p");
        messageElement.className = sender === 'user' ? "chat-user" : "chat-bot";
        messageElement.textContent = message;
        output.appendChild(messageElement);

        // Scroll to the bottom
        output.scrollTop = output.scrollHeight;
    }

    // Ask if user wants to ask anything else
    function askIfWantMoreQuestions() {
        const questionElement = document.createElement("p");
        questionElement.className = "chat-bot";
        questionElement.textContent = "Would you like to ask anything else?";
        output.appendChild(questionElement);

        // Speak the question
        speak("Would you like to ask anything else?");

        // Create the Yes/No buttons only after the speech finishes
        setTimeout(() => {
            if (!document.querySelector('.yes-no-buttons')) {
                const yesButton = document.createElement("button");
                yesButton.textContent = "Yes";
                yesButton.className = "yes-button";
                yesButton.addEventListener("click", function () {
                    output.textContent = ''; // Clear previous output
                    removeButtons(); // Remove buttons
                    startRecognition(); // Start a new recognition cycle
                });

                const noButton = document.createElement("button");
                noButton.textContent = "No";
                noButton.className = "no-button";
                noButton.addEventListener("click", function () {
                    transcriptionModal.style.display = "none"; // Close modal on No
                    removeButtons(); // Remove buttons
                });

                // Append buttons to modal
                const buttonContainer = document.createElement("div");
                buttonContainer.className = "yes-no-buttons";
                buttonContainer.appendChild(yesButton);
                buttonContainer.appendChild(noButton);
                transcriptionModal.querySelector(".modal-content").appendChild(buttonContainer);
            }
        }, 6000);
    }

    // Function to remove the Yes/No buttons
    function removeButtons() {
        const buttonContainer = transcriptionModal.querySelector('.yes-no-buttons');
        if (buttonContainer) {
            buttonContainer.remove();
        }
    }

    // Start Speech Recognition when Voice Assistant Button is clicked
    const voiceAssistantButton = document.getElementById("voiceAssistantButton");
    voiceAssistantButton.addEventListener("click", startRecognition);

    // Close Modal
    closeModalButton.addEventListener("click", () => {
        transcriptionModal.style.display = "none"; // Hide the modal when close button is clicked
        removeButtons(); // Remove buttons if modal is closed
    });

    window.addEventListener("click", (event) => {
        if (event.target === transcriptionModal) {
            transcriptionModal.style.display = "none"; // Close modal if clicked outside
            removeButtons(); // Remove buttons if modal is closed
        }
    });
});
