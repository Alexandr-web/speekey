<template>
  <div
    class="notification"
    :class="{
      'notification--error': data.type === 'error',
      'notification--warning': data.type === 'warning',
      'notification--success': data.type === 'success',
    }"
  >
    <h5 class="notification__title">
      {{ data.title || (data.type === 'error' ? 'Ошибка' : data.type === 'warning' ? 'Внимание' : 'Успех') }}
    </h5>
    <p class="notification__desc">
      {{ data.desc }}
    </p>
  </div>
</template>

<script>
  export default {
    name: "VNotificationComponent",
    props: {
      data: {
        type: Object,
        required: true,
      },
    },
    mounted() {
      setTimeout(() => {
        this.$emit("hideNotification");
      }, 5000);
    },
  };
</script>