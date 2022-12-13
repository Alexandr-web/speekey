const express = require("express");
const router = express.Router();
const authController = require("../controllers/Auth.controller");
const rateLimit = require("express-rate-limit");
const serverIsTooBusy = require("../middleware/serverIsTooBusy");

const registrationLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: (req, res) => {
    return res.status(429).json({
      status: 429,
      message: "Слишком много попыток регистрации. Повторите еще раз через 1 час",
      ok: false,
      type: "error",
    });
  },
});
const loginLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: (req, res) => {
    return res.status(429).json({
      status: 429,
      message: "Слишком много попыток входа. Повторите еще раз через 30 минут",
      ok: false,
      type: "error",
    });
  },
});

router.post("/registration", registrationLimit, serverIsTooBusy, authController.registration);
router.post("/login", loginLimit, serverIsTooBusy, authController.login);

module.exports = router;