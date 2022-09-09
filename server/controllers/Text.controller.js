const TextModel = require("../models/Text");
const User = require("../models/User");

class Text {
  async create(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно быть авторизованным", type: "error", });
      }

      const textData = { ...req.body, userId: req.userId, };
      const text = await TextModel.create(textData);

      return res.status(200).json({ ok: true, message: "Текст создан", type: "success", id: text.id, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }

  async getRandom(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно быть авторизованным", type: "error", });
      }

      const texts = await TextModel.findAll();

      return res.status(200).json({ ok: true, text: texts.sort(() => Math.random() - 0.5)[0], });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }

  async getOne(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно быть авторизованным", type: "error", });
      }

      const { id, } = req.params;
      const text = await TextModel.findOne({ where: { id, }, });

      return res.status(200).json({ ok: true, text, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }

  async getNext(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно быть авторизованным", type: "error", });
      }

      const { id, } = req.params;
      const texts = await TextModel.findAll();
      const findIndexText = texts.findIndex(({ id: textId, }) => textId === parseInt(id));

      let text = null;

      if (findIndexText === -1) {
        return res.status(404).json({ ok: false, message: "Такого текста не существует", type: "error", });
      }

      if (texts[findIndexText + 1]) {
        text = texts[findIndexText + 1];
      }

      if (findIndexText + 1 >= texts.length) {
        text = texts[0];
      }

      return res.status(200).json({ ok: true, text, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }

  async setFavorite(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно быть авторизованным", type: "error", });
      }

      const { id, } = req.params;
      const text = await TextModel.findOne({ where: { id, }, });

      if (!text) {
        return res.status(404).json({ ok: false, message: "Такого текста не существует", type: "error", });
      }

      const user = await User.findOne({ where: { id: req.userId, }, });
      const copyFavorites = [...user.favorites];
      const findIndexText = copyFavorites.findIndex((textId) => textId === parseInt(id));

      let message = "";

      if (findIndexText === -1) {
        copyFavorites.push(parseInt(id));

        message = "Текст добавлен в избранное";
      } else {
        copyFavorites.splice(findIndexText, 1);

        message = "Текст удален из списка избранных";
      }

      await user.update({ favorites: copyFavorites, });

      return res.status(200).json({ ok: true, message, type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }
}

module.exports = new Text();