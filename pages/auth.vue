<template>
  <div class="page">
    <div class="container">
      <div class="page__inner">
        <div class="notifications">
          <vNotification
            v-if="notificationData.show"
            :data="notificationData"
            @hideNotification="hideNotification"
          />
        </div>
        <div class="auth">
          <div class="auth__inner">
            <div class="auth__block">
              <h3 class="auth__block-title">
                Регистрация
              </h3>
              <form
                class="auth__block-form form"
                @submit.prevent="registration"
              >
                <div class="form__field">
                  <label
                    class="form__label"
                    for="registration-username"
                    :class="{
                      'invalid-input': validations.registrationUsername.$invalid,
                      'show': validations.registrationUsername.model.length
                    }"
                  >
                    <input
                      id="registration-username"
                      v-model.trim="validations.registrationUsername.model"
                      class="form__input"
                      type="text"
                      placeholder="Имя"
                    >
                  </label>
                </div>
                <div class="form__field">
                  <label
                    class="form__label"
                    for="registration-email"
                    :class="{
                      'invalid-input': validations.registrationEmail.$invalid,
                      'show': validations.registrationEmail.model.length
                    }"
                  >
                    <input
                      id="registration-email"
                      v-model.trim="validations.registrationEmail.model"
                      class="form__input"
                      type="text"
                      placeholder="Электронная почта"
                    >
                  </label>
                </div>
                <div class="form__field">
                  <label
                    class="form__label"
                    for="registration-password"
                    :class="{
                      'invalid-input': validations.registrationPassword.$invalid,
                      'show': validations.registrationPassword.model.length
                    }"
                  >
                    <input
                      id="registration-password"
                      v-model.trim="validations.registrationPassword.model"
                      class="form__input"
                      type="password"
                      placeholder="Пароль"
                    >
                  </label>
                </div>
                <div class="form__field">
                  <label
                    class="form__label"
                    for="registration-repeat-password"
                    :class="{
                      'invalid-input': validations.registrationRepeatPassword.$invalid,
                      'show': validations.registrationRepeatPassword.model.length
                    }"
                  >
                    <input
                      id="registration-repeat-password"
                      v-model.trim="validations.registrationRepeatPassword.model"
                      class="form__input"
                      type="password"
                      placeholder="Повторите пароль"
                    >
                  </label>
                </div>
                <div class="form__submit-block">
                  <button
                    class="form__submit"
                    :disabled="pendingRegistration"
                  >
                    Зарегистрироваться
                  </button>
                </div>
              </form>
            </div>
            <div class="auth__block">
              <h3 class="auth__block-title">
                Вход
              </h3>
              <form
                class="auth__block-form form"
                @submit.prevent="login"
              >
                <div class="form__field">
                  <label
                    class="form__label"
                    for="login-email"
                    :class="{
                      'invalid-input': validations.loginEmail.$invalid,
                      'show': validations.loginEmail.model.length
                    }"
                  >
                    <input
                      id="login-email"
                      v-model.trim="validations.loginEmail.model"
                      class="form__input"
                      type="text"
                      placeholder="Электронная почта"
                    >
                  </label>
                </div>
                <div class="form__field">
                  <label
                    class="form__label"
                    for="login-password"
                    :class="{
                      'invalid-input': validations.loginPassword.$invalid,
                      'show': validations.loginPassword.model.length
                    }"
                  >
                    <input
                      id="login-password"
                      v-model.trim="validations.loginPassword.model"
                      class="form__input"
                      type="password"
                      placeholder="Пароль"
                    >
                  </label>
                </div>
                <div class="form__submit-block">
                  <button
                    class="form__submit"
                    :disabled="pendingLogin"
                  >
                    Войти
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vNotification from "@/components/vNotification";
  import notificationMixin from "@/mixins/notificationMixin";
  import setLocalThemeMixin from "@/mixins/setLocalThemeMixin";

  export default {
    name: "AuthPage",
    components: { vNotification, },
    mixins: [notificationMixin, setLocalThemeMixin],
    middleware: "checkAlreadyAuth",
    data: () => ({
      validations: {
        registrationEmail: {
          rules: {
            required: true,
            email: true,
          },
          model: "",
        },
        registrationUsername: {
          rules: {
            minLength: 6,
            required: true,
          },
          model: "",
        },
        registrationPassword: {
          rules: {
            minLength: 6,
            required: true,
          },
          model: "",
        },
        registrationRepeatPassword: {
          rules: {
            sameAs: "registrationPassword",
            required: true,
          },
          model: "",
        },
        loginEmail: {
          rules: {
            required: true,
            email: true,
          },
          model: "",
        },
        loginPassword: {
          rules: {
            minLength: 6,
            required: true,
          },
          model: "",
        },
      },
      pendingRegistration: false,
      pendingLogin: false,
    }),
    head: { title: "Авторизация", },
    methods: {
      // User registration
      registration() {
        if (this.getValidData("registration")) {
          // We take keys whose names begin with registration and which have a model
          const fd = Object.keys(this.validations).reduce((acc, key) => {
            if (/^registration/.test(key) && typeof this.validations[key] === "object" && "model" in this.validations[key]) {
              acc[key] = this.validations[key].model;
            }

            return acc;
          }, {});
          const res = this.$store.dispatch("auth/registration", fd);

          this.pendingRegistration = true;

          res.then(({ ok, message, type, }) => {
            this.pendingRegistration = false;

            this.callNotification({
              desc: message,
              type,
              show: true,
            });

            if (ok) {
              this.$router.go(0);
            }
          }).catch((err) => {
            this.callNotification({
              title: "Ошибка",
              desc: `Произошла ошибка: ${err}`,
              type: "error",
              show: true,
            });

            throw err;
          });
        } else {
          this.callNotification({
            title: "Внимание",
            desc: "Все поля должны быть заполнены правильно",
            type: "warning",
            show: true,
          });
        }
      },

      /**
       * Takes from the validations object all keys that start with type and checks their validity
       * @param {string} type Start of keys to check
       */
      getValidData(type) {
        return Object
          .keys(this.validations)
          .filter((key) => new RegExp(`^${type}`).test(key))
          .every((key) => !this.validations[key].$invalid);
      },

      // User login
      login() {
        if (this.getValidData("login")) {
          // We take keys whose names begin with login and which have a model
          const fd = Object.keys(this.validations).reduce((acc, key) => {
            if (/^login/.test(key) && typeof this.validations[key] === "object" && "model" in this.validations[key]) {
              acc[key] = this.validations[key].model;
            }

            return acc;
          }, {});
          const res = this.$store.dispatch("auth/login", fd);

          this.pendingLogin = true;

          res.then(({ ok, message, type, }) => {
            this.pendingLogin = false;

            this.callNotification({
              desc: message,
              type,
              show: true,
            });

            if (ok) {
              this.$router.go(0);
            }
          }).catch((err) => {
            this.callNotification({
              title: "Ошибка",
              desc: `Произошла ошибка: ${err}`,
              type: "error",
              show: true,
            });

            throw err;
          });
        } else {
          this.callNotification({
            title: "Внимание",
            desc: "Все поля должны быть заполнены правильно",
            type: "warning",
            show: true,
          });
        }
      },
    },
  };
</script>