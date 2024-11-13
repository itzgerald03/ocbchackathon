const pool = require("../config");

const AccountModel = {
  getAccountsByUserId: async (userId) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT account_id, account_type, balance::float AS balance FROM accounts WHERE user_id = $1",
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw error;
    } finally {
      client.release();
    }
  },
};

module.exports = AccountModel;
