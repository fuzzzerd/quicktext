<template>
  <div class="icons">
    <button @click="toggleSettingsPanel">...</button>
    <SlidingPanel
      :is-visible="isSettingsPanelOpen"
      @close="isSettingsPanelOpen = false"
    >
      <ul>
        <li>Lorem ipsum dolor sit amet.</li>
        <li>Consectetur adipiscing elit.</li>
        <li>Sed do eiusmod tempor incididunt.</li>
        <li @click="toggleAboutPanel" style="cursor: pointer">About</li>
      </ul>
    </SlidingPanel>

    <SlidingPanel
      :is-visible="isAboutPanelOpen"
      @close="isAboutPanelOpen = false"
    >
      <div class="row">
        <div class="col col-large">
          <p>
            Save your common text strings or messages to your local storage.
          </p>
        </div>
      </div>
    </SlidingPanel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SlidingPanel from './SlidingPanel.vue';

const isSettingsPanelOpen = ref(false);
const isAboutPanelOpen = ref(false);

function toggleSettingsPanel() {
  isSettingsPanelOpen.value = !isSettingsPanelOpen.value;
  if (isSettingsPanelOpen.value) {
    isAboutPanelOpen.value = false;
  }
}

function toggleAboutPanel() {
  isAboutPanelOpen.value = !isAboutPanelOpen.value;
  if (isAboutPanelOpen.value) {
    isSettingsPanelOpen.value = false;
  }
}
</script>

<style scoped>
button {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 1.5rem;
  cursor: pointer;
}
ul {
  list-style: none;
  padding: 1rem;
  margin: 0;
}
li {
  padding: 0.5rem 0;
}
</style>
