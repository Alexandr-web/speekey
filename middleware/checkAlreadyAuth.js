import jwtDecode from "jwt-decode";

/**
 * This middleware is mainly used on login pages
 * Checking an already logged in user
 */
export default async ({ store, redirect, }) => {
  try {
    store.dispatch("auth/autoLogin");

    const token = store.getters["auth/getToken"];

    /**
     * If there is a token, then we check for the presence of a user with an identifier from this token
     * If the user does not exist, then delete the token data and user data
     * If the user exists, then redirect him to the main page
     */
    if (token) {
      const data = jwtDecode(store.getters["auth/getToken"]);
      const res = await store.dispatch("profile/getOne", data.id);

      if (!res.user) {
        store.commit("profile/clearUser");
        store.commit("auth/clearToken");

        return;
      }

      return redirect("/");
    }
  } catch (err) {
    throw err;
  }
};