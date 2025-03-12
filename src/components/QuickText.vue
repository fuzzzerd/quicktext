<script setup lang="ts">
import { useStringStore } from '@/stores/stringStore';

const stringStore = useStringStore();

async function shareItem(data: string) {
  const shareData = {
    title: 'Quick Text',
    url: undefined,
    text: data
  };

  if (navigator.canShare && navigator.canShare(shareData)) {
    await navigator.share(shareData);
  } else {
    console.log('Web Share API not supported.');
  }
}

async function copyItem(data: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(data);
  } else {
    console.log('Clipboard API not supported.');
  }
}

function removeItem(data: string) {
  stringStore.removeQuickText(data);
}
</script>

<template>
  <div class="row fill-width" v-for="qt in stringStore.quickTexts" :key="qt.id">
    <div class="col details">
      {{ qt.text }}
    </div>
    <div class="col icons">
      <button @click="copyItem(qt.text)">📃</button>
      <button @click="shareItem(qt.text)">💬</button>
      <button @click="removeItem(qt.text)">❌</button>
    </div>
  </div>
</template>

<style scoped>
.fill-width {
  justify-content: space-between;
}

.details {
  flex: 1;
  flex-basis: 380px;
}

.icons {
  display: flex;
  flex-grow: 0;

  button {
    width: 50px;
    height: 50px;
    margin: 0;
    padding: 0;
  }
}
</style>
