<script setup lang="ts">
import SlidingPanel from './SlidingPanel.vue';
import { ref, useTemplateRef } from 'vue';
import { useStringStore } from '@/stores/stringStore';

const newTextEntry = useTemplateRef('newTextEntry');
const isAddPanelVisible = ref(false);
const stringModel = ref('');
const stringStore = useStringStore();

const toggleAddPanel = () => {
  isAddPanelVisible.value = !isAddPanelVisible.value;
  if (isAddPanelVisible.value && newTextEntry.value) {
    newTextEntry.value.focus();
  }
};

function addMsg() {
  stringStore.addQuickText(stringModel.value);
  stringModel.value = '';
  isAddPanelVisible.value = false;
}
</script>

<template>
  <button class="fab" @click="toggleAddPanel">➕</button>

  <SlidingPanel
    :is-visible="isAddPanelVisible"
    @close="isAddPanelVisible = false"
  >
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
</template>

<style scoped>
.fab {
  position: fixed;
  bottom: 0.5rem;
  right: 0.5rem;
  width: 3rem;
  height: 3rem;
  margin: 0;
  border-radius: 50%;
  background-color: var(--accent);
  color: var(--accent);
  font-size: 1.25rem;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101;
}
</style>
