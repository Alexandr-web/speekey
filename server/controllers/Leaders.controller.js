const User = require("../models/User");

class Leaders {
  async getAll(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно быть авторизованным", type: "error", });
      }

      const users = await User.findAll();
      const leaders = users
        .filter(({ speed, accuracy, }) => [speed, accuracy].every((n) => n > 0))
        .sort(({ speed: speedA, }, { speed: speedB, }) => speedB - speedA);

      return res.status(200).json({ ok: true, leaders, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", type: "error", });
    }
  }
}

module.exports = new Leaders();