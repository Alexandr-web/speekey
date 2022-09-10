<template>
  <svg
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    :class="classes.filter(Boolean).join(' ')"
  >
    <defs>
    </defs>
    <title />
    <g id="checkmark">
      <line
        class="cls-1"
        x1="3"
        x2="12"
        y1="16"
        y2="25"
      />
      <line
        class="cls-1"
        x1="12"
        x2="29"
        y1="25"
        y2="7"
      />
    </g>
  </svg>
</template>

<script>
  export default {
    name: "CheckmarkIconComponent",
    props: {
      classes: {
        type: Array,
        default: () => ([]),
      },
    },
  };
</script>

<style>
  .cls-1 {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
  }
</style>