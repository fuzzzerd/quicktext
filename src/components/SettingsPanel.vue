<template>
  <div class="icons">
    <button @click="toggleSettingsPanel">...</button>
    <SlidingPanel
      :is-visible="isSettingsPanelOpen"
      @close="isSettingsPanelOpen = false"
    >
      <ul>
        <InstallPrompt />
        <li @click="toggleCategoryManager" style="cursor: pointer">Manage Categories</li>
        <li @click="toggleHelpPanel" style="cursor: pointer">Help</li>
      </ul>
    </SlidingPanel>

    <SlidingPanel
      :is-visible="isHelpPanelOpen"
      @close="isHelpPanelOpen = false"
    >
      <WelcomeContent @add-text="handleAddText" />
    </SlidingPanel>

    <SlidingPanel
      :is-visible="isCategoryManagerOpen"
      @close="isCategoryManagerOpen = false"
    >
      <CategoryManager @close="isCategoryManagerOpen = false" />
    </SlidingPanel>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InstallPrompt from './InstallPrompt.vue';
import SlidingPanel from './SlidingPanel.vue';
import WelcomeContent from './WelcomeContent.vue';
import CategoryManager from './CategoryManager.vue';

const emit = defineEmits<{
  addText: []
}>();

const isSettingsPanelOpen = ref(false);
const isHelpPanelOpen = ref(false);
const isCategoryManagerOpen = ref(false);

function toggleSettingsPanel() {
  isSettingsPanelOpen.value = !isSettingsPanelOpen.value;
  if (isSettingsPanelOpen.value) {
    isHelpPanelOpen.value = false;
    isCategoryManagerOpen.value = false;
  }
}

function toggleHelpPanel() {
  isHelpPanelOpen.value = !isHelpPanelOpen.value;
  if (isHelpPanelOpen.value) {
    isSettingsPanelOpen.value = false;
    isCategoryManagerOpen.value = false;
  }
}

function toggleCategoryManager() {
  isCategoryManagerOpen.value = !isCategoryManagerOpen.value;
  if (isCategoryManagerOpen.value) {
    isSettingsPanelOpen.value = false;
    isHelpPanelOpen.value = false;
  }
}

function handleAddText() {
  emit('addText');
  isHelpPanelOpen.value = false;
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
