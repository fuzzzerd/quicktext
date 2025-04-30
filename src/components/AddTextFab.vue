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
  bottom: 3rem; /* Position above the BottomBar */
  right: 3rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: var(--accent-background);
  color: var(--accent);
  font-size: 1.25rem;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101; /* Below BottomBar's panel but above main content */
}

/* Styles for the panel content if needed, copied/adapted from App.vue or BottomBar.vue if necessary */
/* Assuming SlidingPanel handles its own base styles */
.row {
  display: flex;
  margin-bottom: 1rem;
}
.col {
  flex: 1;
  padding: 0 0.5rem;
}
.col-large {
  flex: 2; /* Or adjust as needed */
}
label {
  display: block;
  margin-bottom: 0.25rem;
}
textarea {
  width: 100%;
  min-height: 60px; /* Adjust as needed */
}
input[type='button'] {
  width: 100%;
}
</style>
