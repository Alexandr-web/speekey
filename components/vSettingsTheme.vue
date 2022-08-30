<template>
  <div class="settings__row-theme">
    <ul class="settings__row-themes">
      <li
        v-for="(theme, index) in themes"
        :key="index"
        class="settings__row-themes-card"
        :class="{
          'active-theme-card': theme.value === activeTheme,
          [theme.className]: true,
        }"
        @click="setTheme(theme.value)"
      >
        {{ theme.name }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      activeTheme: {
        type: String,
        required: true,
      },
    },
    data: () => ({
      themes: [
        {
          name: "serika dark",
          value: "serika-dark",
          className: "serika-dark-card",
        },
        {
          name: "monokai",
          value: "monokai",
          className: "monokai-card",
        }
      ],
    }),
    methods: {
      setTheme(val) {
        document.body.dataset.theme = val;

        this.$emit("setActiveTheme", val);
      },
    },
  };
</script>