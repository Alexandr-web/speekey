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
          <span class="testing-focus__text">Нажмите, чтобы начать</span>
        </div>
      </div>
      <p
        class="testing__text"
        :class="{
          'testing__text--disabled': !start
        }"
      >
        <span
          v-for="(lData, index) in text"
          :key="index"
          class="testing__letter"
          :class="{
            'testing__letter--complete': lData.complete,
            'testing__letter--failure': lData.failure,
            'testing__letter--active': lData.active,
          }"
        >{{ lData.letter }}</span>
      </p>
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
    },
  };
</script>