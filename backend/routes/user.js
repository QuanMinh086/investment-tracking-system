const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const userOnly = require('../middleware/userOnly');

router.get('/profile', auth, userOnly, userController.getProfile);
router.put('/profile', auth, userOnly, userController.updateProfile);
router.get('/transactions', auth, userOnly, userController.getTransactions);
router.get('/investments', auth, userOnly, userController.getInvestments);

module.exports = router; 