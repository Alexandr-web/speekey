const express = require("express");
const router = express.Router();
const textController = require("../controllers/Text.controller");
const isAuth = require("../middleware/isAuth");

router.post("/create", isAuth, textController.create);
router.post("/:id/favorite", isAuth, textController.setFavorite);
router.get("/api/random", isAuth, textController.getRandom);
router.get("/api/:id", isAuth, textController.getOne);
router.get("/api/next/:id", isAuth, textController.getNext);

module.exports = router;