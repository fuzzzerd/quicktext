<script setup lang="ts">
import { ref } from 'vue';
import { useStringStore } from '@/stores/stringStore';
import QuickTextItem from './QuickTextItem.vue';

const stringStore = useStringStore();
const stringModel = ref('');

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

function addMsg() {
  stringStore.addQuickText(stringModel.value);
  stringModel.value = '';
}

function removeItem(data: string) {
  stringStore.removeQuickText(data);
}
</script>

<template>
  <div class="row">
    <div class="col col-large">
      <textarea type="text" name="msgAdd" v-model="stringModel"></textarea>
      <input type="button" value="Add" @click="addMsg" />
    </div>
  </div>
  <QuickTextItem v-for="qt in stringStore.quickTexts" :key="qt.id">
    <template #icon>
      <button @click="copyItem(qt.text)">📃</button>
      <button @click="shareItem(qt.text)">💬</button>
      <button @click="removeItem(qt.text)">❌</button>
    </template>
    {{ qt.text }}
  </QuickTextItem>
</template>
