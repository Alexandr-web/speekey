import jwtDecode from "jwt-decode";

/**
 * This middleware is used on all pages, except pages with authorization
 * Checks if the user is logged in
 * Also, if the user exists, then set it to the store with a valid avatar
 */
export default async ({ store, redirect, }) => {
  try {
    store.dispatch("auth/autoLogin");

    if (!store.getters["auth/getToken"]) {
      return redirect("/auth");
    }

    const data = jwtDecode(store.getters["auth/getToken"]);
    const res = await store.dispatch("profile/getOne", data.id);

    if (!res.user) {
      store.commit("auth/clearToken");
      store.commit("profile/clearUser");

      return redirect("/auth");
    }

    const { id, } = data;
    const { ok, user, } = await store.dispatch("profile/getOne", id);

    if (ok) {
      store.commit("profile/setUser", user);
    }
  } catch (err) {
    throw err;
  }
};