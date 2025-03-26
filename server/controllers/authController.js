const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {};

authController.register = (req, res) => {
  const { fullName, email, password, role } = req.body;
  console.log('Received Register Data:', req.body); // Debug log
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  User.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    User.create(fullName, email, password, role, (err, result) => {
      if (err) return res.status(500).json({ message: 'Registration failed' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

authController.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  User.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, role: user.role }, 'secret_key', { expiresIn: '1h' });
      res.json({ token, role: user.role, fullName: user.full_name });
    });
  });
};

module.exports = authController;