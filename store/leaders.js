const host = require("../server/host");

export default {
  actions: {
    async getAll({ }, token) {
      try {
        const res = await fetch(`${host}/leaders/api`, {
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