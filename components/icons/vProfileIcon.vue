<template>
  <svg
    id="Livello_1"
    data-name="Livello 1"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    :class="classes.filter(Boolean).join(' ')"
  ><defs>
  </defs><title /><path d="M0,32A32,32,0,1,0,32,0,32,32,0,0,0,0,32Z" /><g id="User"><path
    class="cls-1"
    d="M46,42.18v5.91a0.91,0.91,0,0,1-.9.91H18a0.91,0.91,0,0,1-.9-0.91V42.18c0-4.77,6.47-8.64,14.45-8.64S46,37.41,46,42.18Z"
  /><ellipse
    class="cls-1"
    cx="31.55"
    cy="21.18"
    rx="6.42"
    ry="6.18"
  /></g></svg>
</template>

<script>
  export default {
    name: "ProfileIconComponent",
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
    stroke-miterlimit: 10;
    stroke-width: 2px;
  }
</style>