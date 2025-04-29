<script setup lang="ts">
import SlidingPanel from './SlidingPanel.vue';
import InstallPrompt from './InstallPrompt.vue';

import { ref, useTemplateRef } from 'vue';
import { useStringStore } from '@/stores/stringStore';

const newTextEntry = useTemplateRef('newTextEntry');

const isAddPanelVisible = ref(false);
const isAboutPanelVisible = ref(false);
const stringModel = ref('');

const stringStore = useStringStore();

const toggleAddPanel = () => {
  isAddPanelVisible.value = !isAddPanelVisible.value;
  if (isAddPanelVisible.value && newTextEntry.value) {
    newTextEntry.value.focus();
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

  <SlidingPanel :is-visible="isAddPanelVisible">
    <div class="row">
      <div class="col col-large">
        <label for="textEntry">Enter text</label>
        <textarea
          ref="newTextEntry"
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
          @click="
            isAddPanelVisible = false;
            stringModel = '';
          "
        />
      </div>
    </div>
  </SlidingPanel>

  <SlidingPanel :is-visible="isAboutPanelVisible">
    <div class="row">
      <div class="col col-large">
        <p>Save your common text strings or messages to your local storage.</p>
      </div>
    </div>
  </SlidingPanel>
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
</style>
