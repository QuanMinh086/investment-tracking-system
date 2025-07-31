const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Investment = sequelize.define('Investment', {
  InvestmentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  AssetName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  AmountInvested: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  ProfitLoss: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  CreatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  UpdatedAt: {
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
  tableName: 'Investments',
  timestamps: false,
});

Investment.belongsTo(User, { foreignKey: 'UserId' });
User.hasMany(Investment, { foreignKey: 'UserId' });

module.exports = Investment; 