const express = require("express");
const router = express.Router();
const profileController = require("../controllers/Profile.controller");

router.get("/:id", profileController.getOne);

module.exports = router;