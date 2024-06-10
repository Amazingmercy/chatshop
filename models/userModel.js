const { DataTypes } = require('sequelize');
const sequelize = require('../DB/config');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  businessName: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  phoneNo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  WhatsAppBussinessLink: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  joinDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = User;
