<template>
  <div v-if="isShowLoader" class="loader-wrap">
    <BSpinner
      type="grow"
      variant="light"
      label="Loading..."
    ></BSpinner>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Loader",
  computed: {
    ...mapGetters(["isShowLoader"])
  }
};
</script>

<style scoped>
.loader-wrap{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display:flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index:999;
}
</style>