<template>
  <div class="page">
    <div class="container">
      <div class="page__inner">
        <div class="logout">
          <h1 class="logout__title">
            Выполняется выход...
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "LogoutPage",
    layout: "default",
    async created() {
      try {
        this.$store.commit("auth/clearToken");
        await this.$router.go(0);
      } catch (err) {
        throw err;
      }
    },
  };
</script>