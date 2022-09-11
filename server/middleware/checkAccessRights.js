const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(403).json({ ok: false, message: "Для выполнения данной операции нужно быть авторизованным", type: "error", });
    }

    const idInToken = req.userId;
    const { id: idInParams, } = req.params;
    const user = await User.findOne({ where: { id: idInParams, }, });

    if (!user) {
      return res.status(404).json({ ok: false, message: "Такого пользователя не существует", type: "error", });
    }

    if (parseInt(idInParams) !== idInToken) {
      return res.status(403).json({ ok: false, message: "Вы выполняете операцию, которая не связана с вашим аккаунтом", type: "error", });
    }

    req.userByParam = user;
    req.userIdInParams = idInParams;

    next();
  } catch (err) {
    console.log(err);

    return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
  }
};