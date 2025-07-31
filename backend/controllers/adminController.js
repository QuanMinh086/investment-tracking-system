const { User, Transaction, Investment } = require('../models');

// User Management
exports.getAllUsers = async (req, res) => {
  try {
    // Only fetch users with UserRole 'User'
    const users = await User.findAll({
      where: { UserRole: 'User' },
      attributes: { exclude: ['PasswordHash'] }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ where: { Email: req.params.email }, attributes: { exclude: ['PasswordHash'] } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const transactions = await Transaction.findAll({ where: { UserId: user.UserId } });
    const investments = await Investment.findAll({ where: { UserId: user.UserId } });
    res.json({ user, transactions, investments });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Transaction Management
exports.createTransaction = async (req, res) => {
  try {
    const { email, type, amount } = req.body;
    if (!email || !type || !amount) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ where: { Email: email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const transaction = await Transaction.create({ UserId: user.UserId, Type: type, Amount: amount });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Investment Management
exports.createInvestment = async (req, res) => {
  try {
    const { email, assetName, amountInvested, profitLoss } = req.body;
    if (!email || !assetName || !amountInvested) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ where: { Email: email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const investment = await Investment.create({ UserId: user.UserId, AssetName: assetName, AmountInvested: amountInvested, ProfitLoss: profitLoss });
    res.status(201).json(investment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateInvestmentByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { assetName, profitLoss } = req.body;
    if (!assetName) return res.status(400).json({ message: 'Missing assetName' });
    const user = await User.findOne({ where: { Email: email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const investment = await Investment.findOne({ where: { UserId: user.UserId, AssetName: assetName } });
    if (!investment) return res.status(404).json({ message: 'Investment not found' });
    investment.ProfitLoss = profitLoss;
    await investment.save();
    res.json(investment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 