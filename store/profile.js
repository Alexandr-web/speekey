const host = require("../server/host");

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
  },
};