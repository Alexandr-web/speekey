<template>
  <div
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
</template>

<script>
  import vCursorIcon from "@/components/icons/vCursorIcon";

  export default {
    name: "TestingFocusComponent",
    components: { vCursorIcon, },
    props: {
      end: {
        type: Boolean,
        required: true,
      },
      start: {
        type: Boolean,
        required: true,
      },
    },
  };
</script>