<template>
  <div class="page">
    <div class="container">
      <div class="notifications">
        <vNotification
          :data="notificationData"
          @hideNotification="hideNotification"
        />
      </div>
      <div class="page__inner">
        <div class="create-text">
          <form
            class="form create-text__form"
            @submit.prevent="createText"
          >
            <div class="form__field">
              <label
                class="form__label"
                for="text"
              >
                <textarea
                  id="text"
                  ref="text"
                  v-model.trim="validations.text.model"
                  class="form__textarea create-text__textarea"
                  placeholder="Написать текст"
                  :class="{
                    'create-text__textarea--invalid': validations.text.$invalid
                  }"
                ></textarea>
              </label>
            </div>
            <div class="form__submit-block">
              <button
                class="form__submit"
                :disabled="pendingCreate"
              >
                Создать
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vNotification from "@/components/vNotification";
  import notificationMixin from "@/mixins/notificationMixin";

  export default {
    name: "CreateTextPage",
    components: { vNotification, },
    mixins: [notificationMixin],
    layout: "default",
    data: () => ({
      pendingCreate: false,
      validations: {
        text: {
          rules: {
            required: true,
            minLength: 20,
          },
          model: "",
        },
      },
    }),
    head: { title: "Создание текста", },
    mounted() {
      this.$refs.text.focus();
    },
    methods: {
      createText() {
        if (!this.validations.$invalid) {
          const token = this.$store.getters["auth/getToken"];
          const fd = { body: this.validations.text.model, };
          const res = this.$store.dispatch("text/create", { token, fd, });

          this.pendingCreate = true;

          res.then(({ ok, type, message, id, }) => {
            this.pendingCreate = false;

            this.callNotification({
              type,
              desc: message,
              show: true,
            });

            if (ok) {
              this.$router.push(`/?text=${id}`);
            }
          }).catch((err) => {
            throw err;
          });
        } else {
          this.callNotification({
            type: "warning",
            desc: "Все поля должны быть заполнены",
            show: true,
          });
        }
      },
    },
  };
</script>