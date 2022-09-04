export default {
  mounted() {
    const localTheme = localStorage.getItem("theme");

    if (localTheme) {
      document.body.dataset.theme = localTheme;
    } else {
      localStorage.setItem("theme", "serika-dark");
      document.body.dataset.theme = "serika-dark";
    }
  },
};