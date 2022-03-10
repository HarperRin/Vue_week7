<template>
  <ToastMessages></ToastMessages>
  <router-view />
</template>

<style lang="scss">
@import "./assets/all"; //scss
// 推薦使用 CDN，因為 svg 不一定可以從 node_modules 導出
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.0/font/bootstrap-icons.css");
</style>

<script>
import emitter from "@/methods/emitter";
import ToastMessages from "@/components/ToastMessages.vue";

export default {
  components: { ToastMessages },
  provide() {
    return {
      emitter,
    };
  },
};
</script>
