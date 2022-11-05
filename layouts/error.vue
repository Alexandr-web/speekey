<template>
  <div class="error__layout">
    <div class="error">
      <div
        class="error__center"
        :style="{
          'transform': `translate(${coordinates.x}px, ${coordinates.y}px)`
        }"
      >
        <h1 class="error__title">
          Ошибка <span class="error__code">{{ error.statusCode }}</span>
        </h1>
        <h2
          v-if="[404, 500].includes(error.statusCode)"
          class="error__subtitle"
        >
          {{ error.statusCode === 404 ? "Страница не найдена" : "Произошла ошибка сервера" }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ErrorLayout",
    props: ["error"],
    data: () => ({
      coordinates: {
        x: 0,
        y: 0,
      },
    }),
    // Set parallax
    mounted() {
      window.addEventListener("mousemove", (e) => {
        const offsetX = (e.clientX / window.innerWidth) * 30 - 15;
        const offsetY = (e.clientY / window.innerHeight) * 10 - 5;

        this.coordinates = { x: offsetX, y: offsetY, };
      });
    },
  };
</script>