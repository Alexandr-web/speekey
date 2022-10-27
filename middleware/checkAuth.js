import jwtDecode from "jwt-decode";

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