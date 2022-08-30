<template>
  <div class="default__layout">
    <vHeader />
    <Nuxt />
  </div>
</template>

<script>
  import vHeader from "@/components/vHeader";

  export default {
    name: "DefaultLayout",
    components: { vHeader, },
    middleware: "checkAuth",
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
</script>