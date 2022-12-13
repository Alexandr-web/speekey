const express = require("express");
const router = express.Router();
const textController = require("../controllers/Text.controller");
const isAuth = require("../middleware/isAuth");
const rateLimit = require("express-rate-limit");
const serverIsTooBusy = require("../middleware/serverIsTooBusy");

const createLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: "Слишком много попыток создания текста. Повторите еще раз через 5 минут",
});
const setFavoriteLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: (req, res) => {
    return res.status(429).json({
      status: 429,
      message: "Слишком много попыток добавления текста в избранное. Повторите еще раз через 5 минут",
      ok: false,
      type: "error",
    });
  },
});

router.get("/random", serverIsTooBusy, isAuth, textController.getRandom);
router.get("/:id", serverIsTooBusy, isAuth, textController.getOne);
router.get("/next/:id", serverIsTooBusy, isAuth, textController.getNext);
router.post("/create", createLimit, serverIsTooBusy, isAuth, textController.create);
router.post("/:id/favorite", setFavoriteLimit, serverIsTooBusy, isAuth, textController.setFavorite);

module.exports = router;