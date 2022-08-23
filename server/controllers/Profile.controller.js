const User = require("../models/User");
const Text = require("../models/Text");

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

      if (!user.completedTexts.includes(text.id)) {
        await user.update({ completedTexts: user.completedTexts.concat(text.id), });
      }

      return res.status(200).json({ ok: true, message: "Текст завершен", type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }
}

module.exports = new Profile();