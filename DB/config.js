require('dotenv').config()
const { Sequelize } = require('sequelize');

// Initialize Sequelize with your MySQL connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.HOST,
  dialect: 'mysql',
});

module.exports = sequelize