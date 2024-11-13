const pool = require("../config");

const TransactionModel = {
  getTransactionsByAccountId: async (accountId) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT transaction_type, amount, transaction_date, description FROM transactions WHERE account_id = $1 ORDER BY transaction_date DESC",
        [accountId]
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    } finally {
      client.release();
    }
  },
};

module.exports = TransactionModel;
