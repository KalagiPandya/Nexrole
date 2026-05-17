const User = require('../models/User');

// GET own profile
exports.getProfile = async (req, res) => {
  try {
    // req.user.userId comes from JWT token (set by protect middleware)
    // .select('-password') means return everything EXCEPT password
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE own profile
exports.updateProfile = async (req, res) => {
  try {
    const { skills, experience, department, certifications } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { skills, experience, department, certifications },
      { new: true } // return updated document
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};