export default {
  data: () => ({
    notificationData: {
      title: "",
      desc: "",
      type: "",
      show: false,
    },
  }),
  methods: {
    hideNotification() {
      this.notificationData.show = false;
    },
    callNotification(options) {
      this.notificationData = options;
    },
  },
};