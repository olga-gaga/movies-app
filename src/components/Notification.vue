<template>
  <div></div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Notification",
  computed: {
    ...mapGetters(["messagePool"])
  },
  watch: {
    messagePool: "showNotification"
  },
  methods: {
    showNotification({
      variant = "",
      message = "No message",
      title = "No title"
    } = {}) {
      this.$bvToast.toast(message, {
        title,
        variant,
        solid: true
      });
    }
  }
};
</script>
