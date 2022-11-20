const TextModel = require("../models/Text");
const User = require("../models/User");
const sequelize = require("../db");

class Text {
  // Adds new text to the database
  async create(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({
          ok: false,
          message: "Для выполнения данной операции нужно быть авторизованным",
          type: "error",
          status: 403,
        });
      }

      const textData = { ...req.body, userId: req.userId, };
      const text = await TextModel.create(textData);

      return res.status(200).json({
        ok: true,
        message: "Текст создан",
        type: "success",
        id: text.id,
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

  // Gets random text
  async getRandom(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({
          ok: false,
          message: "Для выполнения данной операции нужно быть авторизованным",
          type: "error",
          status: 403,
        });
      }

      const texts = await TextModel.findAll({ order: sequelize.random(), });

      return res.status(200).json({
        ok: true,
        text: texts[0],
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

  // Gets one text by id
  async getOne(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({
          ok: false,
          message: "Для выполнения данной операции нужно быть авторизованным",
          type: "error",
          status: 403,
        });
      }

      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, status: 400, message: "Неверный формат id текста", });
      }

      const text = await TextModel.findOne({ where: { id, }, });

      return res.status(200).json({ ok: true, text, status: 200, });
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

  // Gets the next text in the list
  async getNext(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({
          ok: false,
          message: "Для выполнения данной операции нужно быть авторизованным",
          type: "error",
          status: 403,
        });
      }

      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, status: 400, message: "Неверный формат id текста", });
      }

      const texts = await TextModel.findAll();
      const findIndexText = texts.findIndex(({ id: textId, }) => textId === parseInt(id));

      let text = null;

      if (findIndexText === -1) {
        return res.status(404).json({
          ok: false,
          message: "Такого текста не существует",
          type: "error",
          status: 404,
        });
      }

      if (texts[findIndexText + 1]) {
        text = texts[findIndexText + 1];
      }

      if (findIndexText + 1 >= texts.length) {
        text = texts[0];
      }

      return res.status(200).json({ ok: true, text, status: 200, });
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

  // Sets the text to favorites
  async setFavorite(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({
          ok: false,
          message: "Для выполнения данной операции нужно быть авторизованным",
          type: "error",
          status: 403,
        });
      }

      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, status: 400, message: "Неверный формат id текста", });
      }

      const text = await TextModel.findOne({ where: { id, }, });

      if (!text) {
        return res.status(404).json({
          ok: false,
          message: "Такого текста не существует",
          type: "error",
          status: 404,
        });
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

      return res.status(200).json({ ok: true, message, type: "success", status: 200, });
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

module.exports = new Text();