<template>
  <div class="settings__row-theme">
    <form class="form settings__row-theme-form">
      <div
        v-for="(theme, index) in themes"
        :key="index"
        class="form__field"
      >
        <label
          class="form__label"
          :for="theme.value"
        >
          <input
            :id="theme.value"
            class="form__radio"
            type="radio"
            name="theme"
            @change="setTheme(theme.value)"
          >
          <div
            class="settings__row-theme-card"
            :class="{
              'active-theme-card': theme.value === activeTheme,
              [theme.className]: true,
            }"
          >
            {{ theme.name }}
          </div>
        </label>
      </div>
    </form>
    <div class="form__submit-block">
      <button
        class="form__submit"
        @click="saveTheme"
      >
        Сохранить
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SettingsThemeComponent",
    data: () => ({
      activeTheme: "",
      themes: [
      {
          name: "milkshake",
          value: "milkshake",
          className: "milkshake-card",
        },
        {
          name: "serika dark",
          value: "serika-dark",
          className: "serika-dark-card",
        },
        {
          name: "monokai",
          value: "monokai",
          className: "monokai-card",
        },
        {
          name: "bushido",
          value: "bushido",
          className: "bushido-card",
        },
        {
          name: "oblivion",
          value: "oblivion",
          className: "oblivion-card",
        },
        {
          name: "cyberspace",
          value: "cyberspace",
          className: "cyberspace-card",
        },
        {
          name: "one dark",
          value: "one-dark",
          className: "one-dark-card",
        }
      ],
    }),
    mounted() {
      const localTheme = localStorage.getItem("theme");

      this.activeTheme = localTheme;
    },
    methods: {
      saveTheme() {
        localStorage.setItem("theme", this.activeTheme);
        this.$emit("callNotification", {
          desc: "Тема установлена",
          type: "success",
          show: true,
        });
      },
      setTheme(val) {
        document.body.dataset.theme = val;
        this.activeTheme = val;
      },
    },
  };
</script>