const host = require("../server/host");

export default {
  state: () => ({
    textData: {},
    text: [],
  }),
  getters: {
    getTextData: (state) => state.textData,
    getText: (state) => state.text,
  },
  mutations: {
    setTextData(state, val) {
      if (val && "body" in val) {
        state.textData = val;
        state.text = val.body.split("").map((l, i) => ({ letter: l, active: i === 0, complete: false, failure: false, }));
      }
    },
    setText(state, val) {
      state.text = val;
    },
    resetText(state) {
      state.text = state.text.map((item, index) => {
        item.active = index === 0;
        item.complete = false;

        return item;
      });
    },
    changeLetter(state, { index, data, }) {
      Object.keys(data).map((key) => {
        if (Object.keys(state.text[index]).includes(key)) {
          state.text[index][key] = data[key];
        }
      });

      if ([!data.active, state.text[index + 1], data.complete].every(Boolean)) {
        state.text[index + 1].active = true;
      }
    },
  },
  actions: {
    async getRandom({ }, token) {
      try {
        const res = await fetch(`${host}/text/api/random`, {
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

    async getOne({ }, { token, id, }) {
      try {
        const res = await fetch(`${host}/text/api/${id}`, {
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

    async getOneExceptOne({ }, { id, token, }) {
      try {
        const res = await fetch(`${host}/text/api/except/${id}`, {
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

    async create({ }, { token, fd, }) {
      try {
        const res = await fetch(`${host}/text/create`, {
          method: "POST",
          headers: {
            "Accept-Type": "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
          body: JSON.stringify(fd),
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },
  },
};