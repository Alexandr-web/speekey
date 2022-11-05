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
    /**
     * Gets random text
     * @param {string} token User token
     * @returns {promise} Request result
     */
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

    /**
     * Gets text by its id
     * @param {string|number} id Text id
     * @param {string} token User token
     * @returns {promise} Request result
     */
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

    /**
     * Gets the next text in the list
     * @param {string|number} id Text id
     * @param {string} token User token
     * @returns {promise} Request result
     */
    async getNext({ }, { id, token, }) {
      try {
        const res = await fetch(`${host}/text/api/next/${id}`, {
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

    /**
     * Sends a request to add text
     * @param {string} token User token
     * @param {object} fd Text data
     * @returns {promise} Request result
     */
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

    /**
     * Sends a request to add text to favorites
     * @param {string} token User token
     * @param {string|number} id Text id
     * @returns {promise} Request result
     */
    async setFavorite({ }, { token, id, }) {
      try {
        const res = await fetch(`${host}/text/${id}/favorite`, {
          method: "POST",
          headers: {
            "Accept-Type": "application/json",
            "Content-Type": "application/json",
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