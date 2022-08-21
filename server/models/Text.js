const sequelize = require("../db");
const { DataTypes, } = require("sequelize");

module.exports = sequelize.define("text", {
  body: { type: DataTypes.TEXT, },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, { tableName: "text", });