const sequelize = require("../db");
const { DataTypes, } = require("sequelize");

module.exports = sequelize.define("user", {
  username: {
    type: DataTypes.TEXT,
    unique: true,
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  email: {
    type: DataTypes.TEXT,
    unique: true,
  },
  password: { type: DataTypes.TEXT, },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, { tableName: "user", });