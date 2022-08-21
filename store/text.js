const host = require("../server/host");

export default {
  actions: {
    async getRandom({ }, token) {
      try {
        const res = await fetch(`${host}/text/random`, {
          method: "GET",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },
  },
};