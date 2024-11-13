// Elements
const accountSelect = document.getElementById("accountSelect");
const balanceElement = document.getElementById("balance");
const transactionList = document.getElementById("transactionList");
const userNameElement = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");

// Retrieve user details from localStorage
const userId = localStorage.getItem("userId");
const userName = localStorage.getItem("userName");

// Display user name
if (userName) {
  userNameElement.textContent = `Hello, ${userName}!`;
}

// Logout functionality
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

// Fetch and render dashboard data
async function loadDashboardData(accountId = null) {
  if (!userId) {
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(`/api/dashboard?userId=${userId}&accountId=${accountId || ""}`);
    const data = await response.json();

    console.log("Dashboard API Response:", data); // Debug log

    if (response.ok) {
      // Populate dropdown with accounts if not already populated
      if (accountSelect.options.length === 0) {
        populateAccountDropdown(data.accounts);
      }

      // Update balance and transactions for the selected account
      balanceElement.textContent = `$${data.balance.toFixed(2)}`;
      populateTransactions(data.transactions);
    } else {
      console.error("Failed to fetch dashboard data:", data.message);
    }
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
}

// Populate the account dropdown
function populateAccountDropdown(accounts) {
  const storedAccountId = localStorage.getItem("selectedAccountId"); // Retrieve stored account ID
  accountSelect.innerHTML = ""; // Clear existing options

  console.log("Populating Accounts Dropdown:", accounts); // Debug log
  accounts.forEach((account) => {
    const option = document.createElement("option");
    option.value = account.account_id;
    option.textContent = `${account.account_type} Account`;
    accountSelect.appendChild(option);
  });

  // Set the dropdown to the stored account ID or the first account
  if (storedAccountId && accounts.some((acc) => acc.account_id.toString() === storedAccountId)) {
    accountSelect.value = storedAccountId;
    loadDashboardData(storedAccountId); // Load data for the stored account ID
  } else if (accounts.length > 0) {
    const firstAccountId = accounts[0].account_id;
    accountSelect.value = firstAccountId;
    localStorage.setItem("selectedAccountId", firstAccountId); // Save the default account ID
    loadDashboardData(firstAccountId); // Load data for the first account
  }
}

// Populate the transactions list
function populateTransactions(transactions) {
  transactionList.innerHTML = ""; // Clear the list

  if (transactions.length === 0) {
    transactionList.innerHTML = "<li>No transactions available</li>";
    return;
  }

  transactions.forEach((transaction) => {
    const formattedAmount = parseFloat(transaction.amount).toFixed(2); // Parse and format the amount
    const formattedDate = new Date(transaction.transaction_date).toLocaleString(); // Format the date

    const li = document.createElement("li");
    li.textContent = `${formattedDate}: ${transaction.transaction_type} - $${formattedAmount}`;
    transactionList.appendChild(li);
  });
}

// Event listener for account dropdown change
accountSelect.addEventListener("change", () => {
  const selectedAccountId = accountSelect.value;
  console.log("Switching to Account ID:", selectedAccountId); // Debug log
  localStorage.setItem("selectedAccountId", selectedAccountId); // Save the selected account ID
  loadDashboardData(selectedAccountId); // Fetch and display data for the selected account
});

// Initial data load
loadDashboardData(localStorage.getItem("selectedAccountId") || null); // Use stored account ID or default
