const express = require("express");
const router = express.Router();
const profileController = require("../controllers/Profile.controller");
const isAuth = require("../middleware/isAuth");

router.get("/api/:id", profileController.getOne);
router.get("/api/:id/text/completed", isAuth, profileController.getCompletedTexts);
router.post("/text/:id/complete", isAuth, profileController.setTextComplete);
router.put("/:id/edit", isAuth, profileController.edit);

module.exports = router;