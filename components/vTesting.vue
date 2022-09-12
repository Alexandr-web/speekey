<template>
  <div
    ref="testing"
    class="testing"
  >
    <vTestingFocus
      :end="end"
      :start="start"
      @startTyping="$emit('startTyping')"
    />
    <vTestingResult
      :end="end"
      :pending-set-favorite="pendingSetFavorite"
      :pending-next-text="pendingNextText"
      :accuracy="accuracy"
      :sec="sec"
      :errors="errors"
      :speed="speed"
      @nextText="$emit('nextText')"
      @againTyping="$emit('againTyping')"
      @setFavorite="$emit('setFavorite')"
    />
    <div
      class="testing__inner"
      :class="{ 'testing--blur': !start }"
    >
      <vTestingHeader
        :speed="speed"
        :accuracy="accuracy"
        :progress="progress"
        :start="start"
      />
      <main class="testing__main">
        <div class="testing__text">
          <div
            v-if="start"
            class="caret"
            :data-view="caretData.view"
            :class="{
              'caret-animate': caretData.animate === 'on',
              'caret-smooth': caretData.smooth === 'on',
            }"
            :style="{
              'left': `${caretData.x}px`,
              'top': `${caretData.y}px`,
              'height': `${caretData.height}px`,
              'width': `${caretData.width}px`,
              'z-index': caretData.zIndex
            }"
          ></div>
          <span
            v-for="(lData, index) in getText"
            :key="index"
            ref="letter"
            class="testing__letter"
            :class="{
              'testing__letter--complete': lData.complete,
              'testing__letter--failure': lData.failure
            }"
          >{{ lData.letter }}</span>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  import vTestingHeader from "@/components/vTestingHeader";
  import vTestingFocus from "@/components/vTestingFocus";
  import vTestingResult from "@/components/vTestingResult";

  export default {
    name: "TestingComponent",
    components: {
      vTestingHeader,
      vTestingFocus,
      vTestingResult,
    },
    props: {
      errors: {
        type: Number,
        required: true,
      },
      accuracy: {
        type: Number,
        required: true,
      },
      start: {
        type: Boolean,
        required: true,
      },
      speed: {
        type: Number,
        required: true,
      },
      end: {
        type: Boolean,
        required: true,
      },
      indexActiveLetter: {
        type: Number,
        required: true,
      },
      sec: {
        type: Number,
        required: true,
      },
      pendingNextText: {
        type: Boolean,
        required: true,
      },
      pendingSetFavorite: {
        type: Boolean,
        required: true,
      },
    },
    data: () => ({
      progress: 0,
      caretData: {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        zIndex: 1,
        view: "default",
        animate: "on",
        smooth: "on",
      },
    }),
    computed: {
      getActiveLetter() {
        return this.$refs.letter[this.indexActiveLetter];
      },
      getText() {
        return this.$store.getters["text/getText"];
      },
      getTextData() {
        return this.$store.getters["text/getTextData"];
      },
      getTestingElement() {
        return this.$refs.testing;
      },
    },
    watch: {
      start(val) {
        if (val) {
          this.moveCaret();

          window.addEventListener("resize", this.moveCaret);
        } else {
          this.clearCaretData();

          window.removeEventListener("resize", this.moveCaret);
        }
      },
      indexActiveLetter() {
        this.moveCaret();
        this.setProgressTyping();
        this.getActiveLetter.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      },
    },
    mounted() {
      const localCaret = JSON.parse(localStorage.getItem("caret"));

      if (localCaret) {
        this.caretData = {
          ...this.caretData,
          ...localCaret,
        };
      }
    },
    methods: {
      setProgressTyping() {
        const lengthCompletedLetters = this.getText.filter(({ complete, }) => complete).length;
        const lengthText = this.getText.length;

        this.progress = Math.floor((lengthCompletedLetters / lengthText) * 100);
      },
      clearCaretData() {
        this.caretData = {
          ...this.caretData,
          x: 0,
          y: 0,
          height: 0,
          width: 0,
          zIndex: 1,
        };
      },
      moveCaret() {
        const { offsetLeft, offsetTop, offsetHeight, offsetWidth, } = this.getActiveLetter;

        this.caretData = {
          ...this.caretData,
          width: ["outline", "block"].includes(this.caretData.view) ? offsetWidth : 3,
          x: offsetLeft,
          y: offsetTop < 0 ? 0 : offsetTop,
          height: offsetHeight,
          zIndex: ["outline", "block"].includes(this.caretData.view) ? -1 : 1,
        };
      },
    },
  };
</script>