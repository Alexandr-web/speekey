<template>
  <div
    ref="testing"
    class="testing"
  >
    <div class="testing__inner">
      <div
        v-if="Object.keys(getTextData).length"
        class="testing-focus testing-window"
        :class="{
          'testing-focus--hide': end || start
        }"
        @click="$emit('startTyping')"
      >
        <div class="testing-focus__inner">
          <vCursorIcon :classes="['testing-focus__icon']" />
          <span class="testing-focus__text">Нажмите, чтобы начать</span>
        </div>
      </div>
      <div
        v-if="end"
        class="testing-result testing-window"
      >
        <table class="testing-result__data">
          <tr class="testing-result__data-row">
            <td class="testing-result__data-column testing-result__data-title">
              Слов в минуту
            </td>
            <td class="testing-result__data-column testing-result__data-value">
              {{ res }}
            </td>
          </tr>
          <tr class="testing-result__data-row">
            <td class="testing-result__data-column testing-result__data-title">
              Количество ошибок
            </td>
            <td class="testing-result__data-column testing-result__data-value">
              {{ errors }}
            </td>
          </tr>
          <tr class="testing-result__data-row">
            <td class="testing-result__data-column testing-result__data-title">
              Количество символов
            </td>
            <td class="testing-result__data-column testing-result__data-value">
              {{ getTextData.body.length }}
            </td>
          </tr>
          <tr class="testing-result__data-row">
            <td class="testing-result__data-column testing-result__data-title">
              Точность
            </td>
            <td class="testing-result__data-column testing-result__data-value">
              {{ accuracy }}%
            </td>
          </tr>
          <tr class="testing-result__data-row">
            <td class="testing-result__data-column testing-result__data-title">
              Время
            </td>
            <td class="testing-result__data-column testing-result__data-value">
              {{ sec }}с
            </td>
          </tr>
        </table>
        <div class="testing-result__controls">
          <div class="testing-result__controls-item">
            <button
              class="testing-result__controls-btn"
              :disabled="pendingNextText"
              @click="$emit('nextText')"
            >
              Следующий
            </button>
          </div>
          <div class="testing-result__controls-item">
            <button
              class="testing-result__controls-btn"
              @click="$emit('againTyping')"
            >
              Заново
            </button>
          </div>
          <div class="testing-result__controls-item">
            <button
              class="testing-result__controls-btn"
              :disabled="pendingSetFavorite"
              @click="$emit('setFavorite')"
            >
              Добавить в избранное
            </button>
          </div>
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
    </div>
  </div>
</template>

<script>
  import vCursorIcon from "@/components/icons/vCursorIcon";

  export default {
    name: "TestingComponent",
    components: { vCursorIcon, },
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
      res: {
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
        this.getActiveLetter.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
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