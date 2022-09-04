<template>
  <div class="default__layout">
    <vHeader />
    <Nuxt />
  </div>
</template>

<script>
  import vHeader from "@/components/vHeader";
  import setLocalThemeMixin from "@/mixins/setLocalThemeMixin";

  export default {
    name: "DefaultLayout",
    components: { vHeader, },
    mixins: [setLocalThemeMixin],
    middleware: "checkAuth",
  };
</script>