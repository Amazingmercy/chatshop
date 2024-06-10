const { DataTypes } = require('sequelize');
const sequelize = require('../DB/config');
const User = require('./userModel')

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  picture_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Referencing the User model
      key: 'id', // Referencing the id column of the User model
    },
  },
});

module.exports = Product;
