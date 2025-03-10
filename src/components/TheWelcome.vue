<script setup lang="ts">
import { ref } from 'vue';
import { useStringStore } from '@/stores/stringStore';
import WelcomeItem from './WelcomeItem.vue';

const csResult = ref(navigator.canShare && navigator.canShare({
  title: 'Quick Text',
  url: undefined,
  text: 'hello world'
}));

const stringStore = useStringStore();
const stringModel = ref('');

async function shareItem(data: string) {
  const shareData = {
    title: 'Quick Text',
    url: undefined,
    text: data
  };

  await navigator.share(shareData);
}

function addMsg() {
  stringStore.addString(stringModel.value);
  stringModel.value = '';
}
</script>

<template>
  <div>
    <input type="text" name="msgAdd" v-model="stringModel" />
    <input type="button" value="Add" @click="addMsg" />
  </div>
  <p>Can share: {{ csResult }}</p>
  <WelcomeItem v-for="text in stringStore.strings" :key="text">
    <template #icon>
      <span @click="shareItem(text)">💬</span>
    </template>
    {{ text }}
  </WelcomeItem>
</template>
