const User = require("../models/User");
const Text = require("../models/Text");
const CompletedText = require("../models/CompletedText");

class Profile {
  async getOne(req, res) {
    try {
      const { id, } = req.params;
      const user = await User.findOne({ where: { id, }, });

      return res.status(200).json({ ok: true, user, });
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

      const user = await User.findOne({ where: { id: req.userId, }, });
      const textData = { ...req.body, textId: text.id, userId: req.userId, };
      const completedText = await CompletedText.create(textData);
      const completedTexts = user.completedTexts.map((idCompletedText) => CompletedText.findOne({ where: { id: idCompletedText, }, }));

      return Promise
        .all(completedTexts)
        .then((texts) => {
          if (!texts.map(({ textId, }) => textId).includes(text.id)) {
            return user.update({ completedTexts: user.completedTexts.concat(completedText.id), });
          }
        }).then(() => {
          return res.status(200).json({ ok: true, message: "Текст завершен", type: "success", });
        }).catch((err) => {
          console.log(err);

          return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
        });
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