<template>
  <div class="page">
    <div class="container">
      <div class="page__inner">
        <vTesting
          v-if="text && text.length"
          :text="text"
          :start="start"
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

        return { text: ok ? text : "", };
      } catch (err) {
        throw err;
      }
    },
    data: () => ({
      start: false,
      invalidKeys: [
        "Escape", "Tab", "Alt", "Control", "Enter",
        "Shift", "Backspace", "NumLock", "Delete", "Insert",
        "CapsLock", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
        "OS"
      ],
    }),
    head: { title: "Тестирование", },
    watch: {
      start(val) {
        window[val ? "addEventListener" : "removeEventListener"]("keydown", this.keydownHandler);
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

          if (activeLetter) {
            if (activeLetter.letter === key) {
              this.changeLetter({
                index: indexActiveLetter,
                data: { ...activeLetter, active: false, complete: true, failure: false, },
              });
            } else {
              this.changeLetter({
                index: indexActiveLetter,
                data: { ...activeLetter, complete: false, failure: true, },
              });
            }
          } else {
            this.start = false;
          }
        }
      },
    },
  };
</script>
