<script setup lang="ts">
defineProps<{ isVisible: boolean }>(); // Remove showOverlay prop
const emit = defineEmits(['close']);

function handleOverlayClick() {
  emit('close');
}
</script>

<template>
  <div>
    <div v-if="isVisible" class="overlay" @click="handleOverlayClick"></div>
    <div :class="['sliding-panel', { visible: isVisible }]">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0); /* Transparent background */
  z-index: 100; /* Below panel, above other content */
}

.sliding-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  max-height: 80vh;
  overflow-y: auto;
  width: 100%;
  background-color: var(--accent-background);
  border-top: 1px solid var(--border);
  transform: translateY(100%);
  transition: transform 0.3s ease-in-out;
  z-index: 101; /* Above overlay */
}

.sliding-panel.visible {
  transform: translateY(0);
}
</style>
