document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      // Store userId and userName in localStorage
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userName", data.firstName);

      // Redirect to dashboard
      window.location.href = "dashboard.html";
    } else {
      // Display error message
      document.getElementById("errorMessage").textContent = data.message || "Invalid login credentials";
    }
  } catch (error) {
    console.error("Login error:", error);
    document.getElementById("errorMessage").textContent = "An error occurred. Please try again.";
  }
});
