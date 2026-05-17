const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ================================
// REGISTER — Create new user
// ================================
exports.register = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password (scramble it so nobody can read it)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user in MongoDB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      department
    });

    res.status(201).json({ 
      message: 'User registered successfully!', 
      userId: user._id 
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ================================
// LOGIN — Verify user and give token
// ================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        role: user.role,
        department: user.department
      } 
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};