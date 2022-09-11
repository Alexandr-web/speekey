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
      const userData = user ? { ...user.dataValues, completedTexts, lengthCreatedTexts: createdTexts.length, } : null;

      return res.status(200).json({ ok: true, user: userData, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }

  async setTextComplete(req, res) {
    try {
      const { id, } = req.params;
      const text = await Text.findOne({ where: { id, }, });

      if (!text) {
        return res.status(404).json({ ok: false, message: "Такого текста не существует", type: "error", });
      }

      const user = await User.findOne({ where: { id: req.userId, }, });
      const completedTexts = await CompletedText.findAll({ where: { userId: req.userId, }, });
      const textData = { ...req.body, textId: text.id, userId: req.userId, };
      const findTextIndex = completedTexts.findIndex(({ textId, }) => textId === text.id);

      if (findTextIndex === -1) {
        await CompletedText.create(textData);
      } else {
        await completedTexts[findTextIndex].update(textData);
      }

      const updateCompletedTexts = await CompletedText.findAll({ where: { userId: req.userId, }, });
      const totalAccuracy = updateCompletedTexts.map(({ accuracy, }) => accuracy);
      const totalSpeed = updateCompletedTexts.map(({ speed, }) => speed);
      const getAverage = (array) => Math.floor((array.reduce((s, n) => s += n)) / (array.length || 1));

      await user.update({
        accuracy: getAverage(totalAccuracy),
        speed: getAverage(totalSpeed),
      });

      return res.status(200).json({ ok: true, message: "Текст завершен", type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }

  async getCompletedTexts(req, res) {
    try {
      const completedTexts = await CompletedText.findAll({ where: { userId: req.userIdInParams, }, });

      return res.status(200).json({ ok: true, completedTexts, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }

  async edit(req, res) {
    try {
      const userData = req.body;

      if ("password" in userData) {
        userData.password = await bcrypt.hash(userData.password, 7);
      }

      if (Object.keys(userData).some((key) => ["email", "username"].includes(key))) {
        const userWithEmail = await User.findOne({ where: { email: userData.email || "", }, });
        const userWithUsername = await User.findOne({ where: { username: userData.username || "", }, });

        if ((userWithEmail && userWithEmail.id !== req.userByParam.id) || (userWithUsername && userWithUsername.id !== req.userByParam.id)) {
          return res.status(400).json({ ok: false, message: "Пользователь с такими данными уже существует, смените имя или электронную почту", type: "error", });
        }
      }

      await req.userByParam.update(userData);

      return res.status(200).json({ ok: true, message: "Изменения сохранены", type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }

  async levelUpdate(req, res) {
    try {
      const { length, } = req.body;
      const newExperience = req.userByParam.experience + Math.floor(req.userByParam.level + length / 100);
      const updates = {};

      if (newExperience >= req.userByParam.level * 10 * 0.5) {
        Object.assign(updates, {
          level: req.userByParam.level + 1,
          experience: (req.userByParam.level * 10 * 0.5) - newExperience,
        });
      } else {
        Object.assign(updates, { experience: newExperience, });
      }

      await req.userByParam.update(updates);

      return res.status(200).json({ ok: true, ...updates, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }

  async getFavorites(req, res) {
    try {
      const favoritesId = req.userByParam.favorites;
      const texts = favoritesId.map((textId) => Text.findOne({ where: { id: textId, }, }));

      return Promise
        .all(texts)
        .then((favorites) => {
          return res.status(200).json({ ok: true, texts: favorites, type: "success", });
        }).catch((err) => {
          console.log(err);

          return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
        });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }

  async removeFavorites(req, res) {
    try {
      const { removeTextsId, } = req.body;
      const updateFavorites = [...req.userByParam.favorites].filter((textId) => !removeTextsId.includes(textId));

      await req.userByParam.update({ favorites: updateFavorites, });

      return res.status(200).json({ ok: true, message: "Данные были удалены", type: "success", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }
}

module.exports = new Profile();