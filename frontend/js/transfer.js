const fromAccountSelect = document.getElementById("fromAccount");
const toAccountSelect = document.getElementById("toAccount");
const transferForm = document.getElementById("transferForm");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");
const userId = localStorage.getItem("userId");

// Populate accounts in dropdowns
async function fetchAccounts() {
  try {
    const response = await fetch(`/api/dashboard?userId=${userId}`);
    const data = await response.json();

    if (response.ok) {
      populateAccountDropdown(fromAccountSelect, data.accounts);
      populateAccountDropdown(toAccountSelect, data.accounts);
    } else {
      errorMessage.textContent = "Failed to load accounts.";
    }
  } catch (error) {
    console.error("Error fetching accounts:", error);
    errorMessage.textContent = "Something went wrong. Please try again.";
  }
}

function populateAccountDropdown(selectElement, accounts) {
  selectElement.innerHTML = "";
  accounts.forEach((account) => {
    const option = document.createElement("option");
    option.value = account.account_id;
    option.textContent = `${account.account_type} (${account.balance.toFixed(2)})`;
    selectElement.appendChild(option);
  });
}

// Handle form submission
transferForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fromAccountId = fromAccountSelect.value;
  const toAccountId = toAccountSelect.value;
  const amount = parseFloat(document.getElementById("amount").value);
  const description = document.getElementById("description").value;

  if (fromAccountId === toAccountId) {
    errorMessage.textContent = "Cannot transfer to the same account.";
    return;
  }

  try {
    const response = await fetch("/api/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fromAccountId, toAccountId, amount, description }),
    });

    const data = await response.json();

    if (response.ok) {
      successMessage.textContent = "Transfer successful!";
      errorMessage.textContent = "";
      fetchAccounts(); // Refresh account balances
    } else {
      errorMessage.textContent = data.message;
      successMessage.textContent = "";
    }
  } catch (error) {
    console.error("Error during transfer:", error);
    errorMessage.textContent = "Something went wrong. Please try again.";
    successMessage.textContent = "";
  }
});

// Initial fetch
fetchAccounts();
