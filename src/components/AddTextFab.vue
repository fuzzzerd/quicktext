<script setup lang="ts">
import SlidingPanel from './SlidingPanel.vue';
import { ref, useTemplateRef, computed } from 'vue';
import { useStringStore } from '@/stores/stringStore';

const newTextEntry = useTemplateRef('newTextEntry');
const isAddPanelVisible = ref(false);
const stringModel = ref('');
const selectedCategoryIds = ref<number[]>([]);
const stringStore = useStringStore();

const fabBottomPosition = computed(() => {
  return stringStore.shouldShowCategoryTabs ? '3.5rem' : '1rem';
});

const toggleAddPanel = () => {
  isAddPanelVisible.value = !isAddPanelVisible.value;
  if (isAddPanelVisible.value && newTextEntry.value) {
    newTextEntry.value.focus();
    // Pre-select active category if one is selected
    if (stringStore.activeCategoryId && stringStore.activeCategoryId !== -1) {
      selectedCategoryIds.value = [stringStore.activeCategoryId];
    } else {
      selectedCategoryIds.value = [];
    }
  }
};

function addMsg() {
  stringStore.addQuickText(
    stringModel.value,
    0,
    selectedCategoryIds.value.length > 0 ? selectedCategoryIds.value : undefined
  );
  stringModel.value = '';
  selectedCategoryIds.value = [];
  isAddPanelVisible.value = false;
}

function toggleCategory(categoryId: number) {
  const index = selectedCategoryIds.value.indexOf(categoryId);
  if (index > -1) {
    selectedCategoryIds.value.splice(index, 1);
  } else {
    selectedCategoryIds.value.push(categoryId);
  }
}
</script>

<template>
  <button class="fab" @click="toggleAddPanel" :style="{ bottom: fabBottomPosition }">➕</button>

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
    
    <div v-if="stringStore.categories.length > 0" class="row">
      <div class="col col-large">
        <label>Categories</label>
        <div class="category-selector">
          <button
            v-for="category in stringStore.sortedCategories"
            :key="category.id"
            type="button"
            :class="['category-chip', { selected: selectedCategoryIds.includes(category.id) }]"
            @click="toggleCategory(category.id)"
          >
            <span v-if="category.icon">{{ category.icon }}</span>
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button
          class="secondary"
          @click="
            isAddPanelVisible = false;
            stringModel = '';
            selectedCategoryIds = [];
          "
        >
          Cancel
        </button>
      </div>
      <div class="col">
        <button class="primary" @click="addMsg">Add</button>
      </div>
    </div>
  </SlidingPanel>
</template>

<style scoped>
.fab {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 3rem;
  height: 3rem;
  margin: 0;
  border-radius: 50%;
  background-color: var(--accent);
  color: var(--accent);
  font-size: 1.25rem;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 49; /* Below category tabs */
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

textarea {
  height: 10rem;
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
</style>
