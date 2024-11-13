document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Store userId and redirect to dashboard
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.firstName); // Optional: Store user's first name
        window.location.href = "dashboard.html";
      } else {
        document.getElementById("errorMessage").textContent = data.message;
      }
    } catch (error) {
      console.error("Login error:", error);
      document.getElementById("errorMessage").textContent = "An error occurred. Please try again.";
    }
  });
  