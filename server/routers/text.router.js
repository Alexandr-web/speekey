const express = require("express");
const router = express.Router();
const textController = require("../controllers/Text.controller");
const isAuth = require("../middleware/isAuth");

router.post("/create", isAuth, textController.create);
router.get("/api/random", isAuth, textController.getRandom);
router.get("/api/:id", isAuth, textController.getOne);
router.get("/api/except/:id", isAuth, textController.getOneExceptOne);

module.exports = router;