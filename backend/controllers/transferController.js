const pool = require("../config");

exports.transferFunds = async (req, res) => {
  const { fromAccountId, toAccountId, amount, description } = req.body;

  if (fromAccountId === toAccountId) {
    return res.status(400).json({ message: "Cannot transfer to the same account" });
  }

  try {
    const client = await pool.connect(); // Use the connection pool

    try {
      await client.query("BEGIN");

      // Check if `fromAccountId` has enough balance
      const fromAccount = await client.query("SELECT balance FROM accounts WHERE account_id = $1", [fromAccountId]);
      if (fromAccount.rows.length === 0) {
        throw new Error("From account not found");
      }

      if (fromAccount.rows[0].balance < amount) {
        throw new Error("Insufficient funds");
      }

      // Deduct from `fromAccountId`
      await client.query(
        "UPDATE accounts SET balance = balance - $1 WHERE account_id = $2",
        [amount, fromAccountId]
      );

      // Add to `toAccountId`
      await client.query(
        "UPDATE accounts SET balance = balance + $1 WHERE account_id = $2",
        [amount, toAccountId]
      );

      // Record the transfer in the `transfers` table
      await client.query(
        `INSERT INTO transfers (from_account_id, to_account_id, amount, description) 
         VALUES ($1, $2, $3, $4)`,
        [fromAccountId, toAccountId, amount, description || "Bank Transfer"]
      );

      // Add transactions for both accounts
      await client.query(
        `INSERT INTO transactions (account_id, transaction_type, amount, description) 
         VALUES ($1, 'Transfer Out', $2, $3)`,
        [fromAccountId, amount, `Transfer to Account ID ${toAccountId}`]
      );

      await client.query(
        `INSERT INTO transactions (account_id, transaction_type, amount, description) 
         VALUES ($1, 'Transfer In', $2, $3)`,
        [toAccountId, amount, `Transfer from Account ID ${fromAccountId}`]
      );

      await client.query("COMMIT");
      res.status(200).json({ message: "Transfer successful" });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error during transfer:", error);
      res.status(500).json({ message: "Transfer failed", error: error.message });
    } finally {
      client.release(); // Release the client back to the pool
    }
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
