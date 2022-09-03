<template>
  <div class="settings__row-caret">
    <form class="form settings__row-caret-form">
      <div class="settings__row-caret-param">
        <div class="settings__row-caret-param-info">
          <h4 class="settings__row-caret-param-title">
            Плавность
          </h4>
          <p class="settings__row-caret-param-desc">
            Знак вставки будет плавно перемещаться между буквами и словами
          </p>
        </div>
        <div class="settings__row-caret-param-actions">
          <label
            class="settings__row-caret-param-label"
            for="smooth-off"
          >
            <input
              id="smooth-off"
              v-model="caret.smooth"
              class="form__radio"
              type="radio"
              name="smooth"
              value="off"
            >
            <span class="settings__row-caret-param-radio">Отключить</span>
          </label>
          <label
            class="settings__row-caret-param-label"
            for="smooth-on"
          >
            <input
              id="smooth-on"
              v-model="caret.smooth"
              class="form__radio"
              type="radio"
              name="smooth"
              value="on"
            >
            <span class="settings__row-caret-param-radio">Включить</span>
          </label>
        </div>
      </div>
      <div class="settings__row-caret-param">
        <div class="settings__row-caret-param-info">
          <h4 class="settings__row-caret-param-title">
            Анимация
          </h4>
          <p class="settings__row-caret-param-desc">
            Появление и исчезновение знака вставки
          </p>
        </div>
        <div class="settings__row-caret-param-actions">
          <label
            class="settings__row-caret-param-label"
            for="animate-off"
          >
            <input
              id="animate-off"
              v-model="caret.animate"
              class="form__radio"
              type="radio"
              name="animate"
              value="off"
            >
            <span class="settings__row-caret-param-radio">Отключить</span>
          </label>
          <label
            class="settings__row-caret-param-label"
            for="animate-on"
          >
            <input
              id="animate-on"
              v-model="caret.animate"
              class="form__radio"
              type="radio"
              name="animate"
              value="on"
            >
            <span class="settings__row-caret-param-radio">Включить</span>
          </label>
        </div>
      </div>
      <div class="settings__row-caret-param">
        <div class="settings__row-caret-param-info">
          <h4 class="settings__row-caret-param-title">
            Вид
          </h4>
          <p class="settings__row-caret-param-desc">
            Изменить внешний вид знака вставки
          </p>
        </div>
        <div class="settings__row-caret-param-actions">
          <label
            class="settings__row-caret-param-label"
            for="caret-default"
          >
            <input
              id="caret-default"
              v-model="caret.view"
              class="form__radio"
              type="radio"
              name="caret"
              value="default"
              :checked="caret.view === 'default'"
            >
            <span class="settings__row-caret-param-radio">
              <div class="caret__view-default"></div>
            </span>
          </label>
          <label
            class="settings__row-caret-param-label"
            for="caret-block"
          >
            <input
              id="caret-block"
              v-model="caret.view"
              class="form__radio"
              type="radio"
              name="caret"
              value="block"
              :checked="caret.view === 'block'"
            >
            <span class="settings__row-caret-param-radio">
              <div class="caret__view-block"></div>
            </span>
          </label>
          <label
            class="settings__row-caret-param-label"
            for="caret-outline"
          >
            <input
              id="caret-outline"
              v-model="caret.view"
              class="form__radio"
              type="radio"
              name="caret"
              value="outline"
              :checked="caret.view === 'outline'"
            >
            <span class="settings__row-caret-param-radio">
              <div class="caret__view-outline"></div>
            </span>
          </label>
        </div>
      </div>
    </form>
    <div class="form__submit-block">
      <button
        class="form__submit"
        @click="saveCaret"
      >
        Сохранить
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SettingsCaretComponent",
    data: () => ({
      caret: {
        smooth: "on",
        view: "default",
        animate: "on",
      },
    }),
    mounted() {
      const localCaret = JSON.parse(localStorage.getItem("caret"));

      if (localCaret) {
        this.caret = localCaret;
      }
    },
    methods: {
      saveCaret() {
        localStorage.setItem("caret", JSON.stringify(this.caret));

        this.$emit("callNotification", {
          show: true,
          type: "success",
          desc: "Знак вставки изменен",
        });
      },
    },
  };
</script>