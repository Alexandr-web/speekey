const User = require("../models/User");
const Text = require("../models/Text");
const CompletedText = require("../models/CompletedText");

class Profile {
  async getOne(req, res) {
    try {
      const { id, } = req.params;
      const user = await User.findOne({ where: { id, }, });
      const completedTexts = user ? await CompletedText.findAll({ where: { userId: id, }, }) : [];
      const createdTexts = user ? await Text.findAll({ where: { userId: id, }, }) : [];
      const userData = { ...user.dataValues, completedTexts: completedTexts.length, createdTexts: createdTexts.length, };

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
}

module.exports = new Profile();