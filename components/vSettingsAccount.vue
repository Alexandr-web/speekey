<template>
  <div class="settings__row-account">
    <form
      class="form"
      @submit.prevent="edit"
    >
      <div class="form__field">
        <label
          class="form__label"
          for="username"
          :class="{
            'invalid-input': validations.username.$invalid,
            'show': validations.username.model.length
          }"
        >
          <input
            id="username"
            v-model.trim="validations.username.model"
            class="form__input"
            type="text"
            placeholder="Имя"
          >
        </label>
      </div>
      <div class="form__field">
        <label
          class="form__label"
          for="email"
          :class="{
            'invalid-input': validations.email.$invalid,
            'show': validations.email.model.length
          }"
        >
          <input
            id="email"
            v-model.trim="validations.email.model"
            class="form__input"
            type="text"
            placeholder="Email"
          >
        </label>
      </div>
      <div class="form__field">
        <label
          class="form__label"
          for="password"
          :class="{
            'invalid-input': validations.password.$invalid,
            'show': validations.password.model.length
          }"
        >
          <input
            id="password"
            v-model.trim="validations.password.model"
            class="form__input"
            type="password"
            placeholder="Пароль"
          >
        </label>
      </div>
      <div class="form__field">
        <label
          class="form__label"
          for="repeatPassword"
          :class="{
            'invalid-input': validations.repeatPassword.$invalid,
            'show': validations.repeatPassword.model.length
          }"
        >
          <input
            id="repeatPassword"
            v-model.trim="validations.repeatPassword.model"
            class="form__input"
            type="password"
            placeholder="Повторите пароль"
          >
        </label>
      </div>
      <div class="form__submit-block">
        <button
          class="form__submit"
          :disabled="pendingEdit"
        >
          Сохранить
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    name: "SettingsAccountComponent",
    data: () => ({
      pendingEdit: false,
      validations: {
        username: {
          rules: { minLength: 6, },
          model: "",
        },
        email: {
          rules: { email: true, },
          model: "",
        },
        password: {
          rules: { minLength: 6, },
          model: "",
        },
        repeatPassword: {
          rules: { sameAs: "password", },
          model: "",
        },
      },
    }),
    computed: {
      getUser() {
        return this.$store.getters["profile/getUser"] || {};
      },
    },
    mounted() {
      Object.keys(this.getUser).map((key) => {
        if (key in this.validations && key !== "password") {
          this.validations[key].model = this.getUser[key];
        }
      });
    },
    methods: {
      edit() {
        if (!this.validations.$invalid) {
          const token = this.$store.getters["auth/getToken"];
          const { id, } = this.getUser;
          const fd = Object.keys(this.validations).reduce((acc, key) => {
            if ("model" in (this.validations[key] || {}) && this.validations[key].model && key !== "repeatPassword") {
              acc[key] = this.validations[key].model;
            }

            return acc;
          }, {});
          const res = this.$store.dispatch("profile/edit", { token, fd, id, });

          this.pendingEdit = true;

          res.then(({ ok, message, type, }) => {
            this.pendingEdit = false;
            
            this.$emit("callNotification", {
              type,
              desc: message,
              show: true,
            });

            if (ok) {
              this.$router.push("/account");
            }
          }).catch((err) => {
            this.$emit("callNotification", {
              type: "error",
              desc: `Произошла ошибка сервера: ${err}`,
              show: true,
            });

            throw err;
          });
        } else {
          this.$emit("callNotification", {
            desc: "Все поля должны быть заполнены правильно",
            type: "warning",
            show: true,
          });
        }
      },
    },
  };
</script>