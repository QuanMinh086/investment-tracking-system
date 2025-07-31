const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  UserId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  PasswordHash: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  UserRole: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  CreatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  UpdatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Users',
  timestamps: false,
});

module.exports = User; 