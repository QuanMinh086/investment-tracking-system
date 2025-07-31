const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    const { Email, Password, UserRole } = req.body;
    if (!Email || !Password || !UserRole) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ where: { Email } });
    if (existing) return res.status(409).json({ message: 'Email already exists' });
    const hash = await bcrypt.hash(Password, 10);
    const user = await User.create({ Email, PasswordHash: hash, UserRole });
    res.status(201).json({ message: 'User created', user: { UserId: user.UserId, Email: user.Email, UserRole: user.UserRole } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({ where: { Email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(Password, user.PasswordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ UserId: user.UserId, Email: user.Email, UserRole: user.UserRole }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.UserRole });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.logout = (req, res) => {
  // JWT is stateless; implement blacklist if needed
  res.json({ message: 'Logged out (client should delete token)' });
}; 