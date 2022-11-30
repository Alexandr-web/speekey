import jwtDecode from "jwt-decode";

const host = require("../server/host");
const Cookie = require("cookie");

export default {
  state: () => ({
    experience: null,
    level: null,
    user: null,
  }),
  mutations: {
    setExperience(state, val) {
      state.experience = val;
    },
    setLevel(state, val) {
      state.level = val;
    },
    setUser(state, val) {
      state.user = val;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  getters: {
    getExperience: (state) => state.experience,
    getLevel: (state) => state.level,
    getUser: (state) => state.user,
  },
  actions: {
    /**
     * Gets the user id by its token
     * @param {string} token User token
     * @returns {promise} Request result
     */
    async getIdByToken({ }, token) {
      try {
        const data = jwtDecode(token || "");

        return (data || {}).id;
      } catch (err) {
        throw err;
      }
    },

    /**
     * Gets a user by their id
     * @param {string|number} id User id
     * @returns {promise} Request result
     */
    async getOne({ }, id) {
      try {
        const res = await fetch(`${host}/api/profile/${id}`, {
          method: "GET",
          headers: { "Accept-Type": "application/json", },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    // Gets the current user's data
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

    /**
     * Sends a request to add text to completed
     * @param {string} token User token
     * @param {string|number} id Text id
     * @param {object} data Text data
     * @returns {promise} Request result
     */
    async setTextComplete({ }, { token, id, data, }) {
      try {
        const res = await fetch(`${host}/api/profile/text/${id}/complete`, {
          method: "POST",
          headers: {
            "Accept-Type": "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
          body: JSON.stringify(data),
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Gets the user's completed texts
     * @param {string} token User token
     * @param {string|number} id User id
     * @returns {promise} Request result
     */
    async getCompletedTexts({ }, { token, id, }) {
      try {
        const res = await fetch(`${host}/api/profile/${id}/text/completed`, {
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
     * Gets favorites texts
     * @param {string} token User token
     * @param {string|number} id User id
     * @returns {promise} Request result
     */
    async getFavoritesTexts({ }, { token, id, }) {
      try {
        const res = await fetch(`${host}/api/profile/${id}/favorites`, {
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
     * Sends a request to change user data
     * @param {string} token User token
     * @param {object} fd User data to be changed
     * @param {string|number} id User id
     * @returns {promise} Request result
     */
    async edit({ }, { token, fd, id, }) {
      try {
        const res = await fetch(`${host}/api/profile/${id}/edit`, {
          method: "PUT",
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
     * Sends a request to update the user level
     * @param {string|number} id User id
     * @param {string} token User token
     * @param {object} fd Data required to update the level
     * @returns {promise} Request result
     */
    async levelUpdate({ }, { id, token, fd, }) {
      try {
        const res = await fetch(`${host}/api/profile/${id}/level/update`, {
          method: "PUT",
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
     * Deletes favorite texts
     * @param {string} token User token
     * @param {string|number} id User id
     * @param {object} fd List of id texts to be deleted
     * @returns {promise} Request result
     */
    async removeFavorites({ }, { token, id, fd, }) {
      try {
        const res = await fetch(`${host}/api/profile/${id}/favorites/remove`, {
          method: "DELETE",
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