<template>
  <div class="category-manager">
    <div class="category-header">
      <div class="header-content">
        <h2>Manage Categories</h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
    </div>
    
    <div class="add-category-row">
      <div class="drag-handle-placeholder"></div>
      <div class="category-info">
        <input
          v-model="newCategoryIcon"
          class="live-edit-icon"
          placeholder="📝"
        />
        <input
          v-model="newCategoryName"
          @keyup.enter="addNewCategory"
          class="live-edit-name"
          placeholder="Category name"
        />
      </div>
      <div class="category-actions">
        <button @click="addNewCategory" :disabled="!newCategoryName.trim()" class="add-button">➕</button>
      </div>
    </div>

    <div class="categories-list" ref="categoriesList">
      <div 
        v-for="(category, index) in stringStore.sortedCategories" 
        :key="category.id"
        class="category-item"
        :data-category-id="category.id"
        draggable="true"
        @dragstart="handleDragStart($event, index)"
        @dragover="handleDragOver"
        @drop="handleDrop($event, index)"
        @dragend="handleDragEnd"
      >
        <div class="drag-handle">☰</div>
        
        <div class="category-info">
          <input
            :value="category.icon || ''"
            @input="updateCategoryIcon(category.id, ($event.target as HTMLInputElement).value)"
            class="live-edit-icon"
            placeholder="📝"
          />
          <input
            :value="category.name"
            @input="updateCategoryName(category.id, ($event.target as HTMLInputElement).value)"
            class="live-edit-name"
            placeholder="Category name"
          />
        </div>
        
        <div class="category-actions">
          <button @click="deleteCategory(category.id)" class="delete-btn">🗑️</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStringStore } from '../stores/stringStore';
import type Category from '../models/category';

const stringStore = useStringStore();

const emit = defineEmits<{
  close: []
}>();

const newCategoryName = ref('');
const newCategoryIcon = ref('');
const draggedIndex = ref<number | null>(null);

function addNewCategory() {
  if (!newCategoryName.value.trim()) return;
  
  stringStore.addCategory(
    newCategoryName.value.trim(),
    newCategoryIcon.value.trim() || undefined
  );
  
  newCategoryName.value = '';
  newCategoryIcon.value = '';
}

function deleteCategory(id: number) {
  if (confirm('Are you sure you want to delete this category? Templates will become uncategorized.')) {
    stringStore.removeCategory(id);
  }
}

function updateCategoryName(categoryId: number, newName: string) {
  if (newName.trim()) {
    stringStore.updateCategory(categoryId, {
      name: newName.trim()
    });
  }
}

function updateCategoryIcon(categoryId: number, newIcon: string) {
  stringStore.updateCategory(categoryId, {
    icon: newIcon.trim() || undefined
  });
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
  
  const categories = [...stringStore.sortedCategories];
  const draggedItem = categories[draggedIndex.value];
  
  if (!draggedItem) return; // Guard against undefined
  
  categories.splice(draggedIndex.value, 1);
  categories.splice(dropIndex, 0, draggedItem);
  
  stringStore.reorderCategories(categories);
  draggedIndex.value = null;
}

function handleDragEnd() {
  draggedIndex.value = null;
}
</script>

<style scoped>
.category-manager {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 75vh;
  padding: 0;
}

.category-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  background: var(--background);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-header h2 {
  margin: 0;
  color: var(--text);
  font-size: 1.25rem;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: var(--text-light);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: var(--accent-background);
}

/* Add Category Row */
.add-category-row {
  display: flex;
  align-items: baseline;
  padding: 0.75rem;
  background: transparent;
  border: none;
  border-radius: 0;
  margin: 1rem;
  margin-bottom: 0;
  gap: 0.75rem;
  height: 56px;
}

.drag-handle-placeholder {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.add-button {
  width: 36px;
  height: 36px;
  padding: 0;
  background: var(--accent);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s, opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-shrink: 0;
}

.add-button:hover:not(:disabled) {
  transform: scale(1.1);
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.categories-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0;
  border-top: 1px solid var(--border);
  margin-top: 1rem;
}

.category-item {
  display: flex;
  align-items: baseline;
  padding: 0.75rem;
  background: transparent;
  border: none;
  border-radius: 0;
  cursor: move;
  transition: none;
  height: 56px;
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
}

.category-item[draggable="true"]:active .drag-handle {
  cursor: grabbing;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.category-icon {
  font-size: 1.2rem;
  min-width: 1.5rem;
  text-align: center;
}

.live-edit-icon {
  width: 40px;
  min-width: 40px;
  height: 36px;
  padding: 0.25rem;
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--text);
  text-align: center;
  font-size: 1.2rem;
  border-radius: 4px;
  transition: border-color 0.2s, box-shadow 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.live-edit-name {
  flex: 1;
  min-width: 0;
  height: 36px;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--text);
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px;
  transition: border-color 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
}

.live-edit-icon:hover,
.live-edit-name:hover {
  border-color: var(--accent);
}

.live-edit-icon:focus,
.live-edit-name:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0.5rem var(--accent-dark);
}

/* Ensure inputs don't affect parent layout */
.live-edit-icon,
.live-edit-name {
  box-sizing: border-box;
  line-height: 1;
  vertical-align: middle;
}

.category-name {
  color: var(--text);
  font-weight: 500;
}

.category-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  min-width: 40px;
}

.category-actions button {
  width: 36px;
  height: 36px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-shrink: 0;
}

.category-actions button:hover {
  transform: scale(1.1);
}


/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .category-manager {
    max-height: 85vh;
  }
  
  .add-category-row,
  .category-item {
    padding: 0.5rem;
  }
  
  .drag-handle,
  .drag-handle-placeholder {
    margin-right: 0.5rem;
  }
}
</style>