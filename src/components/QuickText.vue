<script setup lang="ts">
import { useStringStore } from '@/stores/stringStore';
import { ref } from 'vue';

const stringStore = useStringStore();
const placeholders = ref({});

async function shareItem(data: string) {
  data = itemThroughTemplate(data, placeholders.value);
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
    await navigator.clipboard.writeText('');
  }
  const templated = itemThroughTemplate(data, placeholders.value);
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(templated);
  } else {
    console.log('Clipboard API not supported.');
  }
}

function itemThroughTemplate(
  text: string,
  context: Record<string, string>
): string {
  const localContext = { ...context };
  const placeholdersFound = text.match(/{{\s*([^}]+)\s*}}/g) || [];
  placeholdersFound.forEach(placeholder => {
    const key = placeholder.replace(/[{}]/g, '').trim();
    if (!localContext[key]) {
      const userValue = window.prompt(`Enter value for ${key}:`) || key;
      localContext[key] = userValue;
    }
  });
  for (const key in localContext) {
    text = text.replace(
      new RegExp(`{{\\s*${key}\\s*}}`, 'g'),
      localContext[key]
    );
  }
  return text;
}

function removeItem(data: string) {
  stringStore.removeQuickText(data);
}
</script>

<template>
  <div
    class="row fill-width item"
    v-for="qt in stringStore.quickTexts"
    :key="qt.id"
  >
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
  align-items: center;
}

.item {
  /* &:first-child{
    border-top: 1px dashed var(--accent);
  } */
  border-bottom: 1px dashed var(--accent);
}
</style>
