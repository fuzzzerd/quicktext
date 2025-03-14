<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { useStringStore } from '@/stores/stringStore';
import InstallPrompt from './InstallPrompt.vue';

const input = useTemplateRef('textEntry');

const isAddPanelVisible = ref(false);
const isAboutPanelVisible = ref(false);
const stringModel = ref('');

const stringStore = useStringStore();

const toggleAddPanel = () => {
  isAddPanelVisible.value = !isAddPanelVisible.value;
  if (isAddPanelVisible.value && input.value) {
    input.value.focus();
  }
};

const toggleAboutPanel = () => {
  isAboutPanelVisible.value = !isAboutPanelVisible.value;
};

function addMsg() {
  stringStore.addQuickText(stringModel.value);
  stringModel.value = '';
  isAddPanelVisible.value = false;
}
</script>

<template>
  <div class="bottom-bar">
    <button @click="toggleAddPanel">Add</button>
    <InstallPrompt />
    <button @click="toggleAboutPanel">About</button>
  </div>

  <div class="sliding-panel container" :class="{ visible: isAddPanelVisible }">
    <div class="row">
      <div class="col col-large">
        <label for="textEntry">Enter text</label>
        <textarea
          ref="textEntry"
          id="textEntry"
          type="text"
          name="msgAdd"
          v-model="stringModel"
        ></textarea>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <input type="button" value="Add" @click="addMsg" />
      </div>
      <div class="col">
        <input
          type="button"
          value="Cancel"
          @click="isAddPanelVisible = false; stringModel = '';"
        />
      </div>
    </div>
  </div>
  <div
    class="sliding-panel container"
    :class="{ visible: isAboutPanelVisible }"
  >
    <div class="row">
      <div class="col col-large">
        <p>Save your common text strings or messages to your local storage.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bottom-bar {
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 102;

  button {
    margin: 0;
  }
}

.sliding-panel {
  position: fixed;
  bottom: 52px;
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
