const express = require("express");
const router = express.Router();
const profileController = require("../controllers/Profile.controller");
const isAuth = require("../middleware/isAuth");
const checkAccessRights = require("../middleware/checkAccessRights");
const rateLimit = require("express-rate-limit");
const serverIsTooBusy = require("../middleware/serverIsTooBusy");

const removeLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: (req, res) => {
    return res.status(429).json({
      status: 429,
      message: "Слишком много попыток удаления профиля. Повторите еще раз через 30 минут",
      ok: false,
      type: "error",
    });
  },
});
const editLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: (req, res) => {
    return res.status(429).json({
      status: 429,
      message: "Слишком много попыток редактирования данных профиля. Повторите еще раз через 30 минут",
      ok: false,
      type: "error",
    });
  },
});
const completeLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: (req, res) => {
    return res.status(429).json({
      status: 429,
      message: "Слишком много попыток совершить выполнение текста. Повторите еще раз через 5 минут",
      ok: false,
      type: "error",
    });
  },
});
const updateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: (req, res) => {
    return res.status(429).json({
      status: 429,
      message: "Слишком много попыток совершить обновление уровня пользователя. Повторите еще раз через 5 минут",
      ok: false,
      type: "error",
    });
  },
});

router.get("/:id", serverIsTooBusy, profileController.getOne);
router.get("/:id/text/completed", serverIsTooBusy, isAuth, checkAccessRights, profileController.getCompletedTexts);
router.get("/:id/favorites", serverIsTooBusy, isAuth, checkAccessRights, profileController.getFavorites);
router.delete("/:id/favorites/remove", removeLimit, serverIsTooBusy, isAuth, checkAccessRights, profileController.removeFavorites);
router.post("/text/:id/complete", completeLimit, serverIsTooBusy, isAuth, profileController.setTextComplete);
router.put("/:id/edit", editLimit, serverIsTooBusy, isAuth, checkAccessRights, profileController.edit);
router.put("/:id/level/update", updateLimit, serverIsTooBusy, isAuth, checkAccessRights, profileController.levelUpdate);

module.exports = router;