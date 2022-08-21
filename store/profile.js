import jwtDecode from "jwt-decode";

const host = require("../server/host");
const Cookie = require("cookie");

export default {
  actions: {
    async getOne({ }, id) {
      try {
        const res = await fetch(`${host}/profile/${id}`, {
          method: "GET",
          headers: { "Accept-Type": "application/json", },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    async getCurrent({ dispatch, }) {
      try {
        const cookieStr = process.browser ? document.cookie : this.app.context.req.headers.cookie || "";
        const findToken = Cookie.parse(cookieStr || "");
        const res = "token" in findToken ? jwtDecode(findToken.token) || {} : {};

        if (Object.keys(res).length) {
          const { user, } = await dispatch("getOne", res.id);

          return user;
        }
      } catch (err) {
        throw err;
      }
    },
  },
};