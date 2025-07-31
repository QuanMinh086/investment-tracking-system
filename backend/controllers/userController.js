const { User, Transaction, Investment } = require('../models');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.UserId, { attributes: { exclude: ['PasswordHash'] } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { Email, UserRole, ...rest } = req.body;
    // Prevent changing Email or UserRole
    const [updated] = await User.update(rest, { where: { UserId: req.user.UserId } });
    if (!updated) return res.status(404).json({ message: 'User not found or no changes' });
    const user = await User.findByPk(req.user.UserId, { attributes: { exclude: ['PasswordHash'] } });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({ where: { UserId: req.user.UserId } });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getInvestments = async (req, res) => {
  try {
    const investments = await Investment.findAll({ where: { UserId: req.user.UserId } });
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 