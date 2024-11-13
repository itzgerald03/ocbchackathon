const AccountModel = require("../models/accountModel");
const TransactionModel = require("../models/transactionModel");

exports.getDashboardData = async (req, res) => {
  const userId = req.query.userId; // Pass user ID as a query parameter

  try {
    // Get all accounts for the user
    const accounts = await AccountModel.getAccountsByUserId(userId);
    console.log("Fetched Accounts:", accounts); // Log accounts
    if (accounts.length === 0) {
      return res.status(404).json({ message: "No accounts found" });
    }

    // Get the selected account ID from the query or default to the first account
    const accountId = req.query.accountId || accounts[0].account_id;
    console.log("Selected Account ID:", accountId); // Log selected account ID

    // Get transactions for the selected account
    const transactions = await TransactionModel.getTransactionsByAccountId(accountId);
    console.log("Fetched Transactions:", transactions); // Log transactions

    // Return accounts, selected account balance, and transactions
    res.status(200).json({
      accounts,
      balance: accounts.find((account) => account.account_id === parseInt(accountId)).balance,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
