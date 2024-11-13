-- Insert a sample user (password: "password123")
INSERT INTO users (email, password, first_name, last_name)
VALUES (
  'testuser@example.com',
  '$2b$10$FRXY.V48ygpyWwP3RTNm4urewXXl5QW46gZNHDjMAcz1A6kZBO.Je', -- bcrypt hash for "password123"
  'Test',
  'User'
);

-- Insert a sample account for the user
INSERT INTO accounts (user_id, account_type, balance)
VALUES (1, 'Savings', 5000.00);

-- Insert sample transactions
INSERT INTO transactions (account_id, transaction_type, amount, description)
VALUES
  (1, 'Deposit', 1000.00, 'Initial deposit'),
  (1, 'Withdrawal', 500.00, 'ATM withdrawal');
