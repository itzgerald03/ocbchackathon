// Elements
const registerForm = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage");

// Event Listener for Registration
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent form submission

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Check if passwords match
  if (password !== confirmPassword) {
    errorMessage.textContent = "Passwords do not match.";
    return;
  }

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ firstName, lastName, email, password })
    });

    const data = await response.json();
    if (response.status === 201) {
      // Successful registration
      window.location.href = "/index.html"; // Redirect to login page
    } else {
      // Show error message
      errorMessage.textContent = data.message;
    }
  } catch (error) {
    console.error("Error during registration:", error);
    errorMessage.textContent = "Something went wrong. Please try again.";
  }
});
