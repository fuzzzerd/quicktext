<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';

const props = defineProps<{
  modelValue: string;
  options: string[];
  placeholder?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isOpen = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const highlightedIndex = ref(-1);

const filteredOptions = computed(() => {
  if (!props.modelValue) return props.options;
  const lower = props.modelValue.toLowerCase();
  return props.options.filter(opt => opt.toLowerCase().includes(lower));
});

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
  isOpen.value = true;
  highlightedIndex.value = -1;
}

function selectOption(option: string) {
  emit('update:modelValue', option);
  isOpen.value = false;
  highlightedIndex.value = -1;
}

function toggleDropdown() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    nextTick(() => inputRef.value?.focus());
  }
}

function handleFocus() {
  isOpen.value = true;
}

function handleKeydown(event: KeyboardEvent) {
  if (!isOpen.value) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      isOpen.value = true;
      event.preventDefault();
    }
    return;
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        filteredOptions.value.length - 1
      );
      break;
    case 'ArrowUp':
      event.preventDefault();
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1);
      break;
    case 'Enter':
      event.preventDefault();
      if (
        highlightedIndex.value >= 0 &&
        highlightedIndex.value < filteredOptions.value.length
      ) {
        selectOption(filteredOptions.value[highlightedIndex.value]!);
      } else {
        isOpen.value = false;
      }
      break;
    case 'Escape':
      isOpen.value = false;
      highlightedIndex.value = -1;
      break;
  }
}

function handleClickOutside(event: MouseEvent) {
  if (
    containerRef.value &&
    !containerRef.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
    highlightedIndex.value = -1;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div ref="containerRef" class="combobox">
    <div class="combobox-input-wrapper">
      <input
        ref="inputRef"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        @input="handleInput"
        @focus="handleFocus"
        @keydown="handleKeydown"
        class="combobox-input"
        role="combobox"
        :aria-expanded="isOpen"
        aria-autocomplete="list"
      />
      <button
        type="button"
        class="combobox-toggle"
        @click="toggleDropdown"
        tabindex="-1"
        aria-label="Toggle options"
      >
        <span class="combobox-arrow" :class="{ open: isOpen }">&#9662;</span>
      </button>
    </div>
    <ul
      v-if="isOpen && filteredOptions.length > 0"
      class="combobox-dropdown"
      role="listbox"
    >
      <li
        v-for="(option, index) in filteredOptions"
        :key="option"
        role="option"
        :class="[
          'combobox-option',
          { highlighted: index === highlightedIndex }
        ]"
        :aria-selected="option === modelValue"
        @mousedown.prevent="selectOption(option)"
        @mouseenter="highlightedIndex = index"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.combobox {
  position: relative;
  width: 100%;
}

.combobox-input-wrapper {
  display: flex;
  align-items: stretch;
}

.combobox-input {
  flex: 1;
  min-width: 0;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.combobox-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  padding: 0;
  border: 1px solid var(--border);
  border-left: none;
  background: var(--background);
  color: var(--text-light);
  cursor: pointer;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.combobox-toggle:hover {
  background-color: var(--accent-background);
}

.combobox-arrow {
  font-size: 0.75rem;
  transition: transform 0.2s;
  line-height: 1;
}

.combobox-arrow.open {
  transform: rotate(180deg);
}

.combobox-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin: 2px 0 0 0;
  padding: 0;
  list-style: none;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 4px;
  max-height: 150px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.combobox-option {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  color: var(--text);
  transition: background-color 0.1s;
}

.combobox-option:hover,
.combobox-option.highlighted {
  background-color: var(--accent-background);
}

.combobox-option[aria-selected='true'] {
  font-weight: 500;
  color: var(--accent);
}
</style>
