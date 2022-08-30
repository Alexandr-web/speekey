<template>
  <div class="settings__row-account">
    <form class="form">
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
            @change="$emit('setUserData', { key: 'username', val: validations.username.model, })"
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
            @change="$emit('setUserData', { key: 'email', val: validations.email.model, })"
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
            @change="$emit('setUserData', { key: 'password', val: validations.password.model, })"
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
    </form>
  </div>
</template>

<script>
  export default {
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
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
    watch: {
      "validations.$invalid": function (val) {
        this.$emit("setCheckingOnValidData", val);
      },
    },
    mounted() {
      Object.keys(this.user).map((key) => {
        if (key in this.validations && key !== "password") {
          this.validations[key].model = this.user[key];
        }
      });
    },
  };
</script>