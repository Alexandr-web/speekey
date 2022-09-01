<template>
  <div class="page">
    <div class="container">
      <div class="notifications">
        <vNotification
          v-if="notificationData.show"
          :data="notificationData"
          @hideNotification="hideNotification"
        />
      </div>
      <div class="page__inner">
        <vTesting
          :start="start"
          :end="end"
          :res="res"
          :invalid-letters="invalidLetters"
          :valid-letters="validLetters"
          :index-active-letter="indexActiveLetter"
          :sec="sec"
          :pending-next-text="pendingNextText"
          :pending-set-favorite="pendingSetFavorite"
          @startTyping="startTyping"
          @nextText="nextText"
          @againTyping="againTyping"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import vTesting from "@/components/vTesting";
  import vNotification from "@/components/vNotification";
  import notificationMixin from "@/mixins/notificationMixin";

  export default {
    name: "IndexPage",
    components: {
      vTesting,
      vNotification,
    },
    mixins: [notificationMixin],
    layout: "default",
    async asyncData({ store, query: { text, }, }) {
      try {
        const requestTextAndSet = (id) => {
        const token = store.getters["auth/getToken"];
        const res = id ? store.dispatch("text/getOne", { token, id, }) : store.dispatch("text/getRandom", token);
        
        res.then(({ ok, text: textData, }) => {
          if (ok) {
            store.commit("text/setTextData", textData);
          }
        }).catch((err) => {
          throw err;
        });
      };

        requestTextAndSet(text);
      } catch (err) {
        throw err;
      }
    },
    data: () => ({
      start: false,
      end: false,
      pendingNextText: false,
      pendingSetFavorite: false,
      timer: null,
      validLetters: 0,
      invalidLetters: 0,
      res: 0,
      sec: 0,
      indexActiveLetter: 0,
      ignoreKeys: ["CapsLock", "Alt", "Shift", "NumLock"],
    }),
    head: { title: "Тестирование", },
    computed: {
      getText() {
        return this.$store.getters["text/getText"];
      },
      getTextData() {
        return this.$store.getters["text/getTextData"];
      },
    },
    watch: {
      start(val) {
        if (val) {
          this.timer = setInterval(() => this.sec += 1, 1000);

          window.addEventListener("keydown", this.keydownHandler);
        } else {
          window.removeEventListener("keydown", this.keydownHandler);

          clearInterval(this.timer);

          this.res = Math.floor(((this.getTextData.body.split(" ").length || 1) / (this.sec || 1)) * 60);
          this.end = true;
          this.indexActiveLetter = 0;
        }
      },
      end(val) {
        if (val) {
          const token = this.$store.getters["auth/getToken"];
          const { id, } = this.getTextData;
          const data = {
            speed: this.res,
            length: this.getText.length,
            errors: this.invalidLetters,
          };
          const res = this.$store.dispatch("profile/setTextComplete", { token, id, data, });

          res.then(({ message, type, }) => {
            this.callNotification({
              desc: message,
              type,
              show: true,
            });
          }).catch((err) => {
            this.callNotification({
              title: "Ошибка",
              desc: `Произошла ошибка сервера: ${err}`,
              type: "error",
              show: true,
            });

            throw err;
          });
        }
      },
    },
    beforeDestroy() {
      window.removeEventListener("keydown", this.keydownHandler);
    },
    methods: {
      againTyping() {
        this.clearParams();
        this.end = false;
      },
      nextText() {
        const token = this.$store.getters["auth/getToken"];
        const res = this.$store.dispatch("text/getOneExceptOne", { token, id: this.getTextData.id, });

        this.pendingNextText = true;

        res.then(({ ok, text: textData, }) => {
          this.pendingNextText = false;

          if (ok) {
            this.$router.push({ query: { text: textData.id, }, });
            this.$store.commit("text/setTextData", textData);
            this.clearParams();
            this.end = false;
          }
        }).catch((err) => {
          this.callNotification({
            title: "Ошибка",
            desc: `Произошла ошибка сервера: ${err}`,
            type: "error",
            show: true,
          });

          throw err;
        });
      },
      clearParams() {
        this.sec = 0;
        this.res = 0;
        this.validLetters = 0;
        this.invalidLetters = 0;
      },
      startTyping() {
        this.start = true;
        this.end = false;
      },
      keydownHandler(e) {
        const key = e.key;
        
        if (!this.ignoreKeys.includes(key)) {
          const indexActiveLetter = this.getText.findIndex(({ active, }) => active);
          const activeLetter = this.getText[indexActiveLetter === -1 ? 0 : indexActiveLetter];
          
          if (key === "Backspace" && this.getText[indexActiveLetter - 1]) {
            if (activeLetter.failure) {
              this.$store.commit("text/changeLetter", {
                index: indexActiveLetter,
                data: { active: true, complete: false, failure: false, },
              });
            } else {
              this.$store.commit("text/changeLetter", {
                index: indexActiveLetter,
                data: { active: false, complete: false, failure: false, },
              });

              this.$store.commit("text/changeLetter", {
                index: indexActiveLetter - 1,
                data: { active: true, complete: false, failure: false, },
              });

              this.indexActiveLetter = indexActiveLetter - 1;
            }
          }

          if (activeLetter.letter === key) {
            this.$store.commit("text/changeLetter", {
              index: indexActiveLetter,
              data: { active: false, complete: true, failure: false, },
            });

            this.validLetters += 1;

            if (indexActiveLetter + 1 >= this.getText.length) {
              this.start = false;
              this.$store.commit("text/resetText");
            } else {
              this.indexActiveLetter = indexActiveLetter + 1;
            }
          } else if (key !== "Backspace") {
            this.$store.commit("text/changeLetter", {
              index: indexActiveLetter,
              data: { complete: false, failure: true, },
            });

            this.invalidLetters += 1;
          }
        }
      },
    },
  };
</script>
