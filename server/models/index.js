const User = require("./User");
const Text = require("./Text");

Text.belongsTo(User);

module.exports = [User, Text];