<template>
  <header
    class="testing__header"
    :class="{ 'testing--blur': !start }"
  >
    <div class="testing__header-top">
      <ul class="testing__header-params">
        <li class="testing__header-param">
          <div class="testing__header-param-title">
            Скорость (с/м)
          </div>
          <div class="testing__header-param-value">
            {{ speed }}
          </div>
        </li>
        <li class="testing__header-param">
          <div class="testing__header-param-title">
            Точность
          </div>
          <div class="testing__header-param-value">
            {{ accuracy }}%
          </div>
        </li>
      </ul>
    </div>
    <div class="testing__header-bottom">
      <div class="testing__header-progress">
        <div class="testing__header-progress-value">
          {{ progress }}%
        </div>
        <div class="testing__header-progress-slider">
          <div
            class="testing__header-progress-slider-line"
            :style="{
              'width': `${progress}%`
            }"
          ></div>
        </div>
        <div class="testing__header-progress-value">
          100%
        </div>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    name: "TestingHeaderComponent",
    props: {
      speed: {
        type: Number,
        required: true,
      },
      start: {
        type: Boolean,
        required: true,
      },
      accuracy: {
        type: Number,
        required: true,
      },
      progress: {
        type: Number,
        required: true,
      },
    },
  };
</script>