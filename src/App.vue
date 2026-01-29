<script setup></script>
<template>
  <router-view />
</template>
<style>
body,
html,
#app {
  width: 100%;
  height: 100%;
  position: relative;
}
body {
  margin: 0;
  padding: 0;
  overflow: hidden; /* 防止 body 滚动，交给组件内部滚动 */
}
</style>
