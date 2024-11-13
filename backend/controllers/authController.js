const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if user exists
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Send user details
      res.status(200).json({
        message: "Login successful",
        userId: user.user_id,
        firstName: user.first_name,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  
exports.register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
