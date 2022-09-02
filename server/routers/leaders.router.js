const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const leadersController = require("../controllers/Leaders.controller");

router.get("/api", isAuth, leadersController.getAll);

module.exports = router;