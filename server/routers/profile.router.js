const express = require("express");
const router = express.Router();
const profileController = require("../controllers/Profile.controller");
const isAuth = require("../middleware/isAuth");
const checkAccessRights = require("../middleware/checkAccessRights");

router.get("/api/:id", profileController.getOne);
router.get("/api/:id/text/completed", isAuth, checkAccessRights, profileController.getCompletedTexts);
router.get("/api/:id/favorites", isAuth, checkAccessRights, profileController.getFavorites);
router.delete("/:id/favorites/remove", isAuth, checkAccessRights, profileController.removeFavorites);
router.post("/text/:id/complete", isAuth, profileController.setTextComplete);
router.put("/:id/edit", isAuth, checkAccessRights, profileController.edit);
router.put("/:id/level/update", isAuth, checkAccessRights, profileController.levelUpdate);

module.exports = router;