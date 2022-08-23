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
          @startWriting="startWriting"
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
      invalidKeys: [
        "Escape", "Tab", "Alt", "Control", "Enter",
        "Shift", "Backspace", "NumLock", "Delete", "Insert",
        "CapsLock", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
        "OS", "Meta", "F1", "F2", "F3", "F4", "F5", "F6",
        "F7", "F8", "F9", "F10", "F11", "F12", "End",
        "PageUp", "PageDown", "ScrollLock", "Pause", "Insert",
        "Home"
      ],
    }),
    async fetch() {
      try {
        const token = this.$store.getters["auth/getToken"];
        const { ok, text: textData, } = await this.$store.dispatch("text/getRandom", token);

        if (ok) {
          this.$store.commit("text/setTextData", textData);
        }
      } catch (err) {
        throw err;
      }
    },
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
          const res = this.$store.dispatch("profile/setTextComplete", { token, id, });

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
      startWriting() {
        this.start = true;
        this.end = false;
      },
      keydownHandler(e) {
        e.preventDefault();
        
        const key = e.key;
        
        if (!this.invalidKeys.includes(key)) {
          const indexActiveLetter = this.getText.findIndex(({ active, }) => active);
          const activeLetter = this.getText[indexActiveLetter];

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
          } else {
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
