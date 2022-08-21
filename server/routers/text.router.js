const express = require("express");
const router = express.Router();
const textController = require("../controllers/Text.controller");
const isAuth = require("../middleware/isAuth");

router.post("/create", isAuth, textController.create);
router.get("/random", isAuth, textController.getRandom);

module.exports = router;