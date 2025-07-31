require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/db');
const { User, Transaction, Investment } = require('./models');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/me', require('./routes/user'));
app.use('/admin', require('./routes/admin'));

// Health check
app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 8000;
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync DB:', err);
  }); 