const User = require("../models/User");
const Text = require("../models/Text");
const CompletedText = require("../models/CompletedText");
const bcrypt = require("bcrypt");

class Profile {
  async getOne(req, res) {
    try {
      const { id, } = req.params;
      const user = await User.findOne({ where: { id, }, });
      const completedTexts = user ? await CompletedText.findAll({ where: { userId: id, }, }) : [];
      const createdTexts = user ? await Text.findAll({ where: { userId: id, }, }) : [];
      const userData = user ? { ...user.dataValues, completedTexts: completedTexts.length, createdTexts: createdTexts.length, } : null;

      return res.status(200).json({ ok: true, user: userData, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }

  async setTextComplete(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно быть авторизованным", type: "error", });
      }

      const { id, } = req.params;
      const text = await Text.findOne({ where: { id, }, });

      if (!text) {
        return res.status(404).json({ ok: false, message: "Такого текста не существует", type: "error", });
      }

      const completedTexts = await CompletedText.findAll({ where: { userId: req.userId, }, });
      const textData = { ...req.body, textId: text.id, userId: req.userId, };
      const findTextIndex = completedTexts.findIndex(({ textId, }) => textId === text.id);

      if (findTextIndex === -1) {
        await CompletedText.create(textData);
      } else {
        await completedTexts[findTextIndex].update(textData);
      }

      return res.status(200).json({ ok: true, message: "Текст завершен", type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }

  async getCompletedTexts(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно быть авторизованным", type: "error", });
      }

      const { id, } = req.params;
      const user = await User.findOne({ where: { id, }, });

      if (!user) {
        return res.status(404).json({ ok: false, message: "Такого пользователя не существует", type: "error", });
      }

      if (req.userId !== user.id) {
        return res.status(403).json({ ok: false, message: "Нельзя получить выполненные тексты у чужого аккаунта", type: "error", });
      }

      const completedTexts = await CompletedText.findAll({ where: { userId: id, }, });

      return res.status(200).json({ ok: true, completedTexts, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }

  async edit(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно быть авторизованным", type: "error", });
      }

      const { id, } = req.params;
      const user = await User.findOne({ where: { id, }, });

      if (!user) {
        return res.status(404).json({ ok: false, message: "Такого пользователя не существует", type: "error", });
      }

      if (user.id !== req.userId) {
        return res.status(403).json({ ok: false, message: "Нельзя изменить настройки чужого аккаунта", type: "error", });
      }

      const userData = req.body;

      if ("password" in userData) {
        userData.password = await bcrypt.hash(userData.password, 7);
      }

      if (Object.keys(userData).some((key) => ["email", "username"].includes(key))) {
        const userWithEmail = await User.findOne({ where: { email: userData.email || "", }, });
        const userWithUsername = await User.findOne({ where: { username: userData.username || "", }, });

        if (userWithEmail || userWithUsername) {
          return res.status(400).json({ ok: false, message: "Пользователь с такими данными уже существует, смените имя или электронную почту", type: "error", });
        }
      }

      await user.update(userData);

      return res.status(200).json({ ok: true, message: "Изменения сохранены", type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }
}

module.exports = new Profile();