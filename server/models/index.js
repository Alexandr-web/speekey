const User = require("./User");
const Text = require("./Text");
const CompletedText = require("./CompletedText");

Text.belongsTo(User);
CompletedText.belongsTo(User);
CompletedText.belongsTo(Text);

module.exports = [User, Text, CompletedText];