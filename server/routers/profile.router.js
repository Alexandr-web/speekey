const express = require("express");
const router = express.Router();
const profileController = require("../controllers/Profile.controller");
const isAuth = require("../middleware/isAuth");

router.get("/api/:id", profileController.getOne);
router.post("/text/:id/complete", isAuth, profileController.setTextComplete);

module.exports = router;