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

function addMsg() {
  stringStore.addQuickText(stringModel.value);
  stringModel.value = '';
}

function removeItem(data: string) {
  stringStore.removeQuickText(data);
}
</script>

<template>
  <div>
    <textarea type="text" name="msgAdd" v-model="stringModel"></textarea>
    <input type="button" value="Add" @click="addMsg" />
  </div>
  <QuickTextItem v-for="qt in stringStore.quickTexts" :key="qt.id">
    <template #icon>
      <button @click="shareItem(qt.text)">💬</button>
      <button @click="removeItem(qt.text)">X</button>
    </template>
    {{ qt.text }}
  </QuickTextItem>
</template>
