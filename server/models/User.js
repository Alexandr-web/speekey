const sequelize = require("../db");
const { DataTypes, } = require("sequelize");

module.exports = sequelize.define("user", {
  username: {
    type: DataTypes.TEXT,
    unique: true,
  },
  favorites: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  email: {
    type: DataTypes.TEXT,
    unique: true,
  },
  experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  password: { type: DataTypes.TEXT, },
  speed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  accuracy: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, { tableName: "user", });