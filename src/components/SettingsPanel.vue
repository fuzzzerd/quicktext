<template>
  <div class="icons">
    <button @click="toggleSettingsPanel">...</button>
    <SlidingPanel
      :is-visible="isSettingsPanelOpen"
      @close="isSettingsPanelOpen = false"
    >
      <ul>
        <InstallPrompt />
        <li @click="toggleAboutPanel" style="cursor: pointer">About</li>
      </ul>
    </SlidingPanel>

    <SlidingPanel
      :is-visible="isAboutPanelOpen"
      @close="isAboutPanelOpen = false"
    >
      <div class="row">
        <div class="col col-large">
          <h2>Privacy First</h2>

          <p>Your privacy is our priority. QuickText:</p>

          <ul>
            <li>
              Stores all data locally in your browser using browser storage APIs
            </li>
            <li>Never transmits your content to any server</li>
            <li>Has zero tracking or analytics</li>
            <li>Works offline as a Progressive Web App (PWA)</li>
          </ul>

          <p>
            All text snippets, templates, and placeholder values remain
            exclusively on your device, ensuring complete privacy and data
            control.
          </p>

          <h2>Lightweight & Fast</h2>

          <p>QuickText is designed with performance in mind:</p>

          <ul>
            <li>Minimal footprint (under 100KB uncompressed)</li>
            <li>Works offline after first load</li>
            <li>Optimized for mobile devices</li>
          </ul>

          <p>
            The app starts up fast and responds quickly to user interaction,
            making it perfect for quickly capturing and retrieving text snippets
            when you need them.
          </p>
        </div>
      </div>
    </SlidingPanel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InstallPrompt from './InstallPrompt.vue';
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
