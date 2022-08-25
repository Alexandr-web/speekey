const sequelize = require("../db");
const { DataTypes, } = require("sequelize");

module.exports = sequelize.define("completedText", {
  speed: { type: DataTypes.INTEGER, },
  length: { type: DataTypes.INTEGER, },
  errors: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, { tableName: "completedText", });