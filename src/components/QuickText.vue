<script setup lang="ts">
import { useStringStore } from '@/stores/stringStore';
import { ref, watch } from 'vue';
import TemplateVariablePanel from './TemplateVariablePanel.vue';
import WelcomeContent from './WelcomeContent.vue';
import BottomBar from './BottomBar.vue';
import EditTextPanel from './EditTextPanel.vue';
import PinEntryPanel from './PinEntryPanel.vue';
import type QuickText from '../models/quickText';

const emit = defineEmits<{
  addText: [];
}>();

const stringStore = useStringStore();
const isTemplateVisible = ref(false);
const currentTemplate = ref('');
const currentAction = ref<'copy' | 'share'>('copy');
const templateVariables = ref<string[]>([]);
const isEditPanelVisible = ref(false);
const editingQuickText = ref<QuickText | null>(null);
const isPinEntryVisible = ref(false);
const draggedIndex = ref<number | null>(null);

// Watch for category changes to auto-show pin prompt
watch(
  () => stringStore.activeCategoryId,
  newCategoryId => {
    if (newCategoryId && newCategoryId !== -1) {
      const category = stringStore.getCategoryById(newCategoryId);
      if (category?.pin && !stringStore.isCategoryAuthorized(newCategoryId)) {
        isPinEntryVisible.value = true;
      }
    }
  }
);

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
    text = text.replace(
      new RegExp(`{{\\s*${key}\\s*}}`, 'g'),
      context[key] ?? ''
    );
  }
  return text;
}

function handleAddText() {
  emit('addText');
}

function startEdit(qt: QuickText) {
  editingQuickText.value = qt;
  isEditPanelVisible.value = true;
}

function handleEditClose() {
  isEditPanelVisible.value = false;
  editingQuickText.value = null;
}

function handlePinEntrySuccess() {
  if (stringStore.activeCategoryId && stringStore.activeCategoryId !== -1) {
    stringStore.authorizeCategory(stringStore.activeCategoryId);
  }
  isPinEntryVisible.value = false;
}

function handlePinEntryClose() {
  isPinEntryVisible.value = false;
  // Keep the category selected but locked - user can try again with the button
}

function handleDragStart(event: DragEvent, index: number) {
  draggedIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}

function handleDrop(event: DragEvent, dropIndex: number) {
  event.preventDefault();

  if (draggedIndex.value === null || draggedIndex.value === dropIndex) return;

  const templates = [...stringStore.filteredQuickTexts];
  const draggedItem = templates[draggedIndex.value];

  if (!draggedItem) return; // Guard against undefined

  templates.splice(draggedIndex.value, 1);
  templates.splice(dropIndex, 0, draggedItem);

  stringStore.reorderQuickTexts(templates);
  draggedIndex.value = null;
}

function handleDragEnd() {
  draggedIndex.value = null;
}
</script>

<template>
  <!-- Show welcome content when no snippets exist -->
  <WelcomeContent
    v-if="stringStore.quickTexts.length === 0 && !stringStore.activeCategoryId"
    @add-text="handleAddText"
  />

  <!-- Show pin entry when category is locked -->
  <div
    v-else-if="stringStore.isActiveCategoryLocked"
    class="pin-required-message"
  >
    <div class="lock-icon">🔒</div>
    <h3>Category Protected</h3>
    <p>This category requires a PIN to view its contents.</p>
    <button @click="isPinEntryVisible = true" class="unlock-btn">
      Enter PIN
    </button>
  </div>

  <!-- Show message when category is selected but has no items -->
  <div
    v-else-if="
      stringStore.filteredQuickTexts.length === 0 &&
      stringStore.activeCategoryId
    "
    class="empty-category-message"
  >
    <p>No templates in this category</p>
    <button @click="handleAddText" class="add-template-btn">
      Add Template
    </button>
  </div>

  <!-- Show snippets when they exist -->
  <div
    v-else
    class="row fill-width item"
    v-for="(qt, index) in stringStore.filteredQuickTexts"
    :key="qt.id"
    :data-template-id="qt.id"
    draggable="true"
    @dragstart="handleDragStart($event, index)"
    @dragover="handleDragOver"
    @drop="handleDrop($event, index)"
    @dragend="handleDragEnd"
  >
    <div class="drag-handle">☰</div>
    <div class="col details" @click="startEdit(qt)">
      {{ qt.text }}
    </div>
    <div class="col icons">
      <button @click.stop="copyItem(qt.text)">📃</button>
      <button @click.stop="shareItem(qt.text)">💬</button>
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

  <EditTextPanel
    :is-visible="isEditPanelVisible"
    :quick-text="editingQuickText"
    @close="handleEditClose"
    @saved="handleEditClose"
    @deleted="handleEditClose"
  />

  <PinEntryPanel
    :is-visible="isPinEntryVisible"
    :category-name="
      stringStore.getCategoryById(stringStore.activeCategoryId || 0)?.name ||
      'Category'
    "
    :category-id="stringStore.activeCategoryId || 0"
    @close="handlePinEntryClose"
    @success="handlePinEntrySuccess"
  />

  <BottomBar />
</template>

<style scoped>
.fill-width {
  justify-content: space-between;
  align-items: center;
}

.item {
  border-bottom: 1px dashed var(--accent);
}

.details {
  cursor: pointer;
  transition: background-color 0.2s;
  padding: 0.5rem;
  margin: -0.5rem;
  border-radius: 4px;
}

.details:hover {
  background-color: var(--accent-background);
}

.empty-category-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--color-text-secondary);
}

.empty-category-message p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.add-template-btn {
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.add-template-btn:hover {
  opacity: 0.9;
}

.pin-required-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--color-text-secondary);
  min-height: 50vh;
  margin: auto;
}

.lock-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.pin-required-message h3 {
  margin: 0 0 1rem 0;
  color: var(--text);
  font-size: 1.25rem;
}

.pin-required-message p {
  margin-bottom: 1.5rem;
  font-size: 1rem;
  color: var(--text-light);
}

.unlock-btn {
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.unlock-btn:hover {
  opacity: 0.9;
}

/* Add padding to bottom when category tabs are visible */
:global(.quicktext-container) {
  padding-bottom: 60px;
}

/* Drag and drop styling */
.item {
  cursor: move;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.drag-handle {
  color: var(--text-light);
  cursor: grab;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1rem;
  line-height: 1;
  padding: 0.5rem;
  margin: -0.5rem 0;
}

.item[draggable='true']:active .drag-handle {
  cursor: grabbing;
}

.item:hover {
  background-color: var(--accent-background);
}
</style>
