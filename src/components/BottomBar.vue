<script setup lang="ts">
import InstallPrompt from './InstallPrompt.vue';
</script>

<template>
  <div class="bottom-bar">
    <InstallPrompt />
  </div>
</template>

<style scoped>
.bottom-bar {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px; /* Explicit height */
  background-color: var(--accent-background);
  border-top: 1px solid var(--border);
  z-index: 10;

  button {
    width: 40px;
    height: 40px;
    border: none;
    box-shadow: none;
  }
}
</style>
