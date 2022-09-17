const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

class Auth {
  async registration(req, res) {
    try {
      const { registrationEmail: email, registrationUsername: username, registrationPassword: password, } = req.body;
      const userWithName = await User.findOne({ where: { username, }, });
      const userWithEmail = await User.findOne({ where: { email, }, });

      if (userWithName || userWithEmail) {
        return res.status(400).json({
          ok: false,
          message: "Пользователь с такими данными уже существует, смените имя или электронную почту",
          type: "error",
          status: 400,
        });
      }

      const hashPassword = await bcrypt.hash(password, 7);
      const userData = { email, username, password: hashPassword, };

      await User.create(userData);

      return res.status(200).json({
        ok: true,
        message: "Пользователь зарегистрирован",
        type: "success",
        status: 200,
      });
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        ok: false,
        message: "Произошла ошибка сервера",
        type: "error",
        status: 500,
      });
    }
  }

  async login(req, res) {
    try {
      const { loginEmail: email, loginPassword: password, } = req.body;
      const user = await User.findOne({ where: { email, }, });

      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "Такого пользователя не существует",
          type: "error",
          status: 404,
        });
      }

      const isTruePassword = await bcrypt.compare(password, user.password);

      if (!isTruePassword) {
        return res.status(400).json({
          ok: false,
          message: "Неверный пароль",
          type: "error",
          status: 400,
        });
      }

      const token = jwt.sign(user.dataValues, process.env.SECRET_KEY, { expiresIn: Math.floor(Date.now() / 1000) + (60 * 60), });

      return res.status(200).json({
        ok: true,
        message: "Пользователь вошел в систему",
        token: `Bearer ${token}`,
        type: "success",
        status: 200,
      });
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        ok: false,
        message: "Произошла ошибка сервера",
        type: "error",
        status: 500,
      });
    }
  }
}

module.exports = new Auth();