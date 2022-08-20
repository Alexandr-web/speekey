const User = require("../models/User");

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
}

module.exports = new Profile();