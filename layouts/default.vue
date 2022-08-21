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
  };
</script>