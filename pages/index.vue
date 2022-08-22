<template>
  <div class="page">
    <div class="container">
      <div class="page__inner">
        <vTesting
          v-if="text && text.length"
          :text="text"
          :start="start"
          :res="res"
          :index-active-letter="indexActiveLetter"
          @startWriting="start = true"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import vTesting from "@/components/vTesting";

  export default {
    name: "IndexPage",
    components: { vTesting, },
    layout: "default",
    async asyncData({ store, }) {
      try {
        const token = store.getters["auth/getToken"];
        const { ok, text: textData, } = await store.dispatch("text/getRandom", token);
        const text = ok ? textData.body.split("").map((l, i) => ({ letter: l, active: i === 0, complete: false, failure: false, })) : [];
        const totalWords = ok ? textData.body.split(" ").length : 0;

        return {
          text,
          totalWords,
        };
      } catch (err) {
        throw err;
      }
    },
    data: () => ({
      start: false,
      res: 0,
      timer: null,
      sec: 0,
      invalidKeys: [
        "Escape", "Tab", "Alt", "Control", "Enter",
        "Shift", "Backspace", "NumLock", "Delete", "Insert",
        "CapsLock", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
        "OS", "Meta", "F1", "F2", "F3", "F4", "F5", "F6",
        "F7", "F8", "F9", "F10", "F11", "F12", "End",
        "PageUp", "PageDown", "ScrollLock", "Pause", "Insert",
        "Home"
      ],
      indexActiveLetter: 0,
    }),
    head: { title: "Тестирование", },
    watch: {
      start(val) {
        if (val) {
          this.timer = setInterval(() => {
            this.sec += 1;
          }, 1000);

          window.addEventListener("keydown", this.keydownHandler);
        } else {
          window.removeEventListener("keydown", this.keydownHandler);

          clearInterval(this.timer);

          this.res = Math.floor(((this.totalWords || 1) / (this.sec || 1)) * 60);
          this.sec = 0;
        }
      },
    },
    methods: {
      changeLetter({ index, data, }) {
        this.text = this.text.map((item, i) => {
          if (i === index) {
            item = data;
          }

          if (!data.active && i === index + 1) {
            item.active = true;
          }

          return item;
        });
      },
      keydownHandler(e) {
        e.preventDefault();
        
        const key = e.key;
        
        if (!this.invalidKeys.includes(key)) {
          const indexActiveLetter = this.text.findIndex(({ active, }) => active);
          const activeLetter = this.text[indexActiveLetter];

          if (activeLetter.letter === key) {
            this.changeLetter({
              index: indexActiveLetter,
              data: { ...activeLetter, active: false, complete: true, failure: false, },
            });

            if (indexActiveLetter + 1 >= this.text.length) {
              this.indexActiveLetter = 0;
              this.start = false;
              this.text = this.text.map((item, index) => {
                item.active = index === 0;
                item.complete = false;

                return item;
              });
            } else {
              this.indexActiveLetter = indexActiveLetter + 1;
            }
          } else {
            this.changeLetter({
              index: indexActiveLetter,
              data: { ...activeLetter, complete: false, failure: true, },
            });
          }
        }
      },
    },
  };
</script>
