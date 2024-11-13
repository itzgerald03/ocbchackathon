const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Respond with userId and firstName
    res.status(200).json({
      userId: user.user_id,
      firstName: user.first_name,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
  
exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", userId: newUser.user_id });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};