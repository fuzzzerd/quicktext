<script setup lang="ts">
import { useStringStore } from '@/stores/stringStore';
import { ref } from 'vue';
import TemplateVariablePanel from './TemplateVariablePanel.vue';
import WelcomeContent from './WelcomeContent.vue';

const emit = defineEmits<{
  addText: [];
}>();

const stringStore = useStringStore();
const isTemplateVisible = ref(false);
const currentTemplate = ref('');
const currentAction = ref<'copy' | 'share'>('copy');
const templateVariables = ref<string[]>([]);

function extractTemplateVariables(text: string): string[] {
  const placeholdersFound = text.match(/{{\s*([^}]+)\s*}}/g) || [];
  return placeholdersFound.map(placeholder =>
    placeholder.replace(/[{}]/g, '').trim()
  );
}

async function shareItem(data: string) {
  const variables = extractTemplateVariables(data);
  if (variables.length > 0) {
    showTemplatePanel(data, 'share');
    return;
  }

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
  const variables = extractTemplateVariables(data);
  if (variables.length > 0) {
    showTemplatePanel(data, 'copy');
    return;
  }

  if (navigator.clipboard) {
    await navigator.clipboard.writeText('');
    await navigator.clipboard.writeText(data);
  } else {
    console.log('Clipboard API not supported.');
  }
}

function showTemplatePanel(text: string, action: 'copy' | 'share') {
  currentTemplate.value = text;
  currentAction.value = action;
  templateVariables.value = extractTemplateVariables(text);
  isTemplateVisible.value = true;
}

async function handleTemplateExecute(variableValues: Record<string, string>) {
  const processedText = itemThroughTemplate(
    currentTemplate.value,
    variableValues
  );

  if (currentAction.value === 'copy') {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText('');
      await navigator.clipboard.writeText(processedText);
    } else {
      console.log('Clipboard API not supported.');
    }
  } else {
    const shareData = {
      title: 'Quick Text',
      url: undefined,
      text: processedText
    };

    if (navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      console.log('Web Share API not supported.');
    }
  }

  // Reset template state
  isTemplateVisible.value = false;
}

function handleTemplateClose() {
  isTemplateVisible.value = false;
}

function itemThroughTemplate(
  text: string,
  context: Record<string, string>
): string {
  for (const key in context) {
    text = text.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), context[key]);
  }
  return text;
}

function removeItem(data: string) {
  stringStore.removeQuickText(data);
}

function handleAddText() {
  emit('addText');
}
</script>

<template>
  <!-- Show welcome content when no snippets exist -->
  <WelcomeContent
    v-if="stringStore.quickTexts.length === 0"
    @add-text="handleAddText"
  />

  <!-- Show snippets when they exist -->
  <div
    v-else
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

  <TemplateVariablePanel
    :is-visible="isTemplateVisible"
    :template-text="currentTemplate"
    :action-type="currentAction"
    :template-variables="templateVariables"
    @close="handleTemplateClose"
    @execute="handleTemplateExecute"
  />
</template>

<style scoped>
.fill-width {
  justify-content: space-between;
  align-items: center;
}

.item {
  border-bottom: 1px dashed var(--accent);
}
</style>
