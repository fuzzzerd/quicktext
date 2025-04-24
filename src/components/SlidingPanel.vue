<script setup lang="ts">
const props = defineProps<{ isVisible: boolean }>();
</script>

<template>
  <div :class="['sliding-panel', { visible: isVisible }]">
    <slot />
  </div>
</template>

<style scoped>
.sliding-panel {
  position: fixed;
  bottom: 40px;
  left: 0;
  width: 100%;
  background-color: var(--accent-background);
  border-top: 1px solid var(--border);
  transform: translateY(100%);
  transition: transform 0.3s ease-in-out;
  z-index: 101;
}

.sliding-panel.visible {
  transform: translateY(0);
}
</style>
