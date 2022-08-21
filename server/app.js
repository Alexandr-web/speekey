const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db");
const cors = require("cors");
const host = require("./host");

require("dotenv").config();
require("./models/index");

app.use(cors({ origin: [host], }));
app.use(bodyParser.urlencoded({ extended: true, }));
app.use(bodyParser.json());

const connectToDatabase = async () => {
  try {
    await db.authenticate();
    await db.sync();

    console.log("Connection has been established successfully.");
  } catch (err) {
    console.log(err);
  }
};

connectToDatabase();

const authRouter = require("./routers/auth.router");
const profileRouter = require("./routers/profile.router");
const textRouter = require("./routers/text.router");

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/text", textRouter);

module.exports = app;