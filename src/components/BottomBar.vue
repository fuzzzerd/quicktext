<script setup lang="ts">
import { useStringStore } from '../stores/stringStore';

const stringStore = useStringStore();
</script>

<template>
  <div 
    v-if="stringStore.shouldShowCategoryTabs" 
    class="bottom-bar"
  >
    <button
      v-if="stringStore.hasUncategorizedItems"
      :class="{ active: stringStore.activeCategoryId === -1 }"
      @click="stringStore.setActiveCategory(-1)"
      title="Uncategorized"
    >
      📁
    </button>
    
    <button
      v-for="category in stringStore.sortedCategories"
      :key="category.id"
      :class="{ active: stringStore.activeCategoryId === category.id, 'has-pin': category.pin }"
      @click="stringStore.setActiveCategory(category.id)"
      :title="category.pin ? `${category.name} (PIN protected)` : category.name"
    >
      <span v-if="category.icon">{{ category.icon }}</span>
      <span v-else class="category-initial">{{ category.name.charAt(0).toUpperCase() }}</span>
      <span v-if="category.pin" class="pin-indicator">🔒</span>
    </button>
    
  </div>
</template>

<style scoped>
.bottom-bar {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px; /* Explicit height */
  background-color: var(--accent-background);
  border-top: 1px solid var(--border);
  z-index: 10;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0;
  gap: 2px;
}

/* Hide scrollbar but keep functionality */
.bottom-bar::-webkit-scrollbar {
  display: none;
}

.bottom-bar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.bottom-bar button {
  /* Reset global button styles */
  width: 40px;
  height: 40px;
  min-width: 40px;
  border: none;
  box-shadow: none;
  background: none;
  margin: 0;
  padding: 0;
  /* Custom styles */
  color: var(--text);
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.2s;
  position: relative;
}

.bottom-bar button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.bottom-bar button:focus {
  outline: none;
  box-shadow: none;
  border: none;
}

.bottom-bar button.active {
  background-color: var(--accent);
  color: white;
}

.category-initial {
  font-weight: bold;
  font-size: 0.9rem;
}

.pin-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  font-size: 0.6rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}


@media (prefers-color-scheme: dark) {
  .bottom-bar button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
