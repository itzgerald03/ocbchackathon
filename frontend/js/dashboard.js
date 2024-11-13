// Elements
const accountSelect = document.getElementById("accountSelect");
const balanceElement = document.getElementById("balance");
const transactionList = document.getElementById("transactionList");
const userNameElement = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");

// Retrieve userId from localStorage
const userId = localStorage.getItem("userId");
const userName = localStorage.getItem("userName");

// Display user name
if (userName) {
  userNameElement.textContent = `Hello, ${userName}!`;
}

logoutBtn.addEventListener("click", () => {
    // Clear localStorage
    localStorage.clear();
  
    // Redirect to login page
    window.location.href = "index.html";
  });
  
// Fetch and render dashboard data
async function loadAccountData(accountId = null) {
  if (!userId) {
    console.error("User ID not found. Please log in again.");
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(`/api/dashboard?userId=${userId}&accountId=${accountId || ""}`);
    const data = await response.json();

    if (response.ok) {
      // Populate account dropdown
      populateAccountDropdown(data.accounts);

      // Update balance
      balanceElement.textContent = `$${data.balance.toFixed(2)}`;

      // Populate transactions
      populateTransactions(data.transactions);
    } else {
      console.error("Failed to fetch dashboard data:", data.message);
    }
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
}

// Populate account dropdown
function populateAccountDropdown(accounts) {
  accountSelect.innerHTML = ""; // Clear existing options
  accounts.forEach((account) => {
    const option = document.createElement("option");
    option.value = account.account_id;

    // Ensure balance is valid before calling toFixed
    const balance = account.balance ? parseFloat(account.balance).toFixed(2) : "0.00";

    option.textContent = `${account.account_type} Account`;
    accountSelect.appendChild(option);
  });
}

// Populate transaction list
function populateTransactions(transactions) {
  transactionList.innerHTML = ""; // Clear existing transactions
  transactions.forEach((transaction) => {
    const li = document.createElement("li");
    li.textContent = `${transaction.transaction_date}: ${transaction.transaction_type} - $${transaction.amount.toFixed(
      2
    )} (${transaction.description})`;
    transactionList.appendChild(li);
  });
}

// Add event listener for account selection change
accountSelect.addEventListener("change", () => {
  const selectedAccountId = accountSelect.value;
  loadAccountData(selectedAccountId);
});

// Initial data load
loadAccountData();
