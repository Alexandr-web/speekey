<template>
  <div class="testing-result testing-window">
    <table class="testing-result__data">
      <tr class="testing-result__data-row">
        <td class="testing-result__data-column testing-result__data-title">
          Слов в минуту
        </td>
        <td class="testing-result__data-column testing-result__data-value">
          {{ speed }}
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
</template>

<script>
  export default {
    name: "TestingResultComponent",
    props: {
      pendingSetFavorite: {
        type: Boolean,
        required: true,
      },
      pendingNextText: {
        type: Boolean,
        required: true,
      },
      accuracy: {
        type: Number,
        required: true,
      },
      sec: {
        type: Number,
        required: true,
      },
      errors: {
        type: Number,
        required: true,
      },
      speed: {
        type: Number,
        required: true,
      },
    },
    computed: {
      getTextData() {
        return this.$store.getters["text/getTextData"];
      },
    },
  };
</script>