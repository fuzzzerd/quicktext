<template>
  <SlidingPanel :is-visible="isVisible" @close="handleClose">
    <div class="edit-panel">
      <h3>Edit Template</h3>

      <div class="row">
        <div class="col col-large">
          <label for="editTextEntry">Text</label>
          <textarea
            id="editTextEntry"
            v-model="localText"
            @input="handleTextChange"
          ></textarea>
        </div>
      </div>

      <div v-if="stringStore.categories.length > 0" class="row">
        <div class="col col-large">
          <label>Categories</label>
          <div class="category-selector">
            <button
              v-for="category in stringStore.sortedCategories"
              :key="category.id"
              type="button"
              :class="[
                'category-chip',
                { selected: localCategoryIds.includes(category.id) }
              ]"
              @click="toggleCategory(category.id)"
            >
              <span v-if="category.icon">{{ category.icon }}</span>
              {{ category.name }}
            </button>
          </div>
        </div>
      </div>

      <div class="row sort-row">
        <div class="col">
          <label for="sortOrder">Sort Order</label>
          <input
            id="sortOrder"
            v-model.number="localSort"
            type="number"
            min="0"
            step="1"
            class="sort-input"
            title="Position in the template list (lower numbers appear first)"
          />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <a class="delete-link" @click="handleDelete">Delete template</a>
        </div>
        <div class="col-right">
          <button class="secondary" @click="handleClose">Cancel</button>
          <button class="primary" @click="handleSave">Save</button>
        </div>
      </div>
    </div>
  </SlidingPanel>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useStringStore } from '../stores/stringStore';
import SlidingPanel from './SlidingPanel.vue';
import type QuickText from '../models/quickText';

const props = defineProps<{
  isVisible: boolean;
  quickText: QuickText | null;
}>();

const emit = defineEmits<{
  close: [];
  saved: [];
  deleted: [];
}>();

const stringStore = useStringStore();
const localText = ref('');
const localCategoryIds = ref<number[]>([]);
const localSort = ref(0);

watch(
  () => props.quickText,
  newQuickText => {
    if (newQuickText) {
      localText.value = newQuickText.text;
      localCategoryIds.value = newQuickText.categoryIds
        ? [...newQuickText.categoryIds]
        : [];
      localSort.value = newQuickText.sort;
    }
  }
);

function handleTextChange() {
  // Text is bound via v-model, no additional action needed
}

function toggleCategory(categoryId: number) {
  const index = localCategoryIds.value.indexOf(categoryId);
  if (index > -1) {
    localCategoryIds.value.splice(index, 1);
  } else {
    localCategoryIds.value.push(categoryId);
  }
}

function handleSave() {
  if (props.quickText && localText.value.trim()) {
    // Update the existing quick text
    stringStore.updateQuickText(props.quickText.id, {
      text: localText.value.trim(),
      sort: localSort.value,
      categoryIds:
        localCategoryIds.value.length > 0 ? localCategoryIds.value : undefined
    });
    emit('saved');
    handleClose();
  }
}

function handleDelete() {
  if (
    props.quickText &&
    confirm('Are you sure you want to delete this template?')
  ) {
    stringStore.removeQuickTextById(props.quickText.id);
    emit('deleted');
    handleClose();
  }
}

function handleClose() {
  localText.value = '';
  localCategoryIds.value = [];
  localSort.value = 0;
  emit('close');
}
</script>

<style scoped>
.edit-panel {
  padding: 1rem;
}

.edit-panel h3 {
  margin-bottom: 1rem;
  color: var(--text);
}

textarea {
  height: 10rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--background);
  color: var(--text);
  font-family: inherit;
  resize: vertical;
}

.category-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.category-chip {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text);
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
  flex: none;
  width: auto;
}

.category-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-chip.selected {
  background-color: var(--accent);
  color: white;
  font-weight: 500;
  border-color: var(--accent);
}

.primary {
  background-color: var(--accent);
  color: var(--accent-background);
}

.secondary {
  background-color: var(--accent-background);
  color: var(--accent);
  border: none;
  box-shadow: none;
}

.delete-link {
  color: #dc3545;
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: underline;
  transition: opacity 0.2s;
}

.delete-link:hover {
  opacity: 0.8;
}

.row {
  margin-bottom: 1rem;
}

.row:last-child {
  margin-bottom: 0;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
}

.col-right {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text);
  font-weight: 500;
}

.sort-row {
  margin-bottom: 0.75rem;
}

.sort-row label {
  font-size: 0.85rem;
  color: var(--text-light);
  margin-bottom: 0.25rem;
}

.sort-input {
  width: 80px;
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--background);
  color: var(--text);
  font-family: inherit;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.sort-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-background);
}
</style>
