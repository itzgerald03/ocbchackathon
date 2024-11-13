const pool = require("../config");

const UserModel = {
  findByEmail: async (email) => {
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);
      return result.rows[0] || null; // Return the user or null
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Database query failed");
    } finally {
      client.release();
    }
  },

  create: async ({ email, password, firstName, lastName }) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO users (email, password, first_name, last_name) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [email, password, firstName, lastName]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating new user:", error);
      throw new Error("Database query failed");
    } finally {
      client.release();
    }
  },
};

module.exports = UserModel;
