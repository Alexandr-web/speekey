const express = require("express");
const router = express.Router();
const textController = require("../controllers/Text.controller");
const isAuth = require("../middleware/isAuth");

router.get("/random", isAuth, textController.getRandom);
router.get("/:id", isAuth, textController.getOne);
router.get("/next/:id", isAuth, textController.getNext);
router.post("/create", isAuth, textController.create);
router.post("/:id/favorite", isAuth, textController.setFavorite);

module.exports = router;