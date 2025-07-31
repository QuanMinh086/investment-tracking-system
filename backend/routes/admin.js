const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// User Management
router.get('/users', auth, role('Admin'), adminController.getAllUsers);
router.get('/users/email/:email', auth, role('Admin'), adminController.getUserByEmail);

// Transaction Management
router.post('/transactions', auth, role('Admin'), adminController.createTransaction);

// Investment Management
router.post('/investments', auth, role('Admin'), adminController.createInvestment);
router.put('/investments/:email', auth, role('Admin'), adminController.updateInvestmentByEmail);

module.exports = router; 