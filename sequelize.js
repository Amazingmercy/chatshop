const { DataTypes } = require('sequelize');
require('dotenv').config();
const sequelize = require('../DB/config');

const WhatsappMessage = sequelize.define('WhatsappMessage', {
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  intent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { sequelize, WhatsappMessage };
