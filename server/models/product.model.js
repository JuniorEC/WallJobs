const { DataTypes } = require("sequelize");

const { sequelize } = require("../config/database.config");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: DataTypes.STRING,
  code: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.FLOAT,
});

module.exports = Product;
