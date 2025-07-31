const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Transaction = sequelize.define('Transaction', {
  TransactionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  TimeStamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'UserId',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'Transactions',
  timestamps: false,
});

Transaction.belongsTo(User, { foreignKey: 'UserId' });
User.hasMany(Transaction, { foreignKey: 'UserId' });

module.exports = Transaction; 