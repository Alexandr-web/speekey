const TextModel = require("../models/Text");
const User = require("../models/User");

class Text {
  async create(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно быть авторизованным", });
      }

      const textData = { ...req.body, userId: req.userId, };
      const newText = await TextModel.create(textData);
      const user = await User.findOne({ where: { id: req.userId, }, });

      await user.update({ createdTexts: user.createdTexts.concat(newText.id), });

      return res.status(200).json({ ok: true, message: "Текст создан", type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", ype: "error", });
    }
  }

  async getRandom(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно быть авторизованным", });
      }

      const texts = await TextModel.findAll();

      return res.status(200).json({ ok: true, text: texts.sort(() => Math.random() - 0.5)[0], });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", ype: "error", });
    }
  }
}

module.exports = new Text();