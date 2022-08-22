<template>
  <div class="testing">
    <div class="testing__inner">
      <div
        class="testing-focus"
        :class="{
          'testing-focus--hide': start
        }"
        @click="$emit('startWriting')"
      >
        <div class="testing-focus__inner">
          <vCursorIcon :classes="['testing-focus__icon']" />
          <span class="testing-focus__text">Нажмите, чтобы начать. <bold v-if="res">Результат: {{ res }} с/м</bold></span>
        </div>
      </div>
      <div
        class="testing__text"
        :class="{ 'testing__text--disabled': !start }"
      >
        <div
          v-if="start"
          class="caret"
          :style="{
            'left': `${caretData.x}px`,
            'top': `${caretData.y}px`,
            'height': `${caretData.height}px`,
          }"
        ></div>
        <span
          v-for="(lData, index) in text"
          :key="index"
          ref="letter"
          class="testing__letter"
          :class="{
            'testing__letter--complete': lData.complete,
            'testing__letter--failure': lData.failure
          }"
        >{{ lData.letter }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import vCursorIcon from "@/components/icons/vCursorIcon";

  export default {
    name: "TestingComponent",
    components: { vCursorIcon, },
    props: {
      text: {
        type: Array,
        required: true,
      },
      start: {
        type: Boolean,
        required: true,
      },
      res: {
        type: Number,
        required: true,
      },
      indexActiveLetter: {
        type: Number,
        required: true,
      },
    },
    data: () => ({
      caretData: {
        x: 0,
        y: 0,
        height: 0,
      },
    }),
    computed: {
      getActiveLetter() {
        return this.$refs.letter[this.indexActiveLetter];
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
      },
    },
    methods: {
      clearCaretData() {
        this.caretData = {
          x: 0,
          y: 0,
          height: 0,
        };
      },
      moveCaret() {
        const { offsetLeft, offsetTop, offsetHeight, } = this.getActiveLetter;

        this.caretData = {
          x: offsetLeft,
          y: offsetTop,
          height: offsetHeight,
        };
      },
    },
  };
</script>