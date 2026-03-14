<template>
  <div class="value-list-manager">
    <div class="manager-header">
      <div class="header-content">
        <h2>Manage Value Lists</h2>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>
    </div>

    <div class="lists-container">
      <div
        v-for="variable in stringStore.allTemplateVariables"
        :key="variable"
        class="list-block"
      >
        <div class="list-header-row" @click="toggleExpanded(variable)">
          <div class="variable-label">{{ variable }}</div>
          <div class="value-count">
            <span v-if="getValues(variable).length > 0" class="count-badge">
              {{ getValues(variable).length }}
            </span>
            <span v-else class="no-values">no options</span>
          </div>
          <button
            class="expand-btn"
            :title="expandedVariable === variable ? 'Collapse' : 'Expand'"
          >
            {{ expandedVariable === variable ? '▾' : '▸' }}
          </button>
        </div>

        <div v-if="expandedVariable === variable" class="values-section">
          <div class="add-value-row">
            <div class="drag-handle-placeholder"></div>
            <input
              v-model="newValueText"
              @keyup.enter="addValue(variable)"
              class="live-edit-value"
              placeholder="Add a value..."
            />
            <button
              @click="addValue(variable)"
              :disabled="!newValueText.trim()"
              class="add-value-button"
            >
              ➕
            </button>
          </div>

          <div
            v-for="(value, vIndex) in getValues(variable)"
            :key="`${variable}-${vIndex}`"
            class="value-item"
            draggable="true"
            @dragstart="handleValueDragStart($event, variable, vIndex)"
            @dragover="handleValueDragOver"
            @drop="handleValueDrop($event, variable, vIndex)"
            @dragend="handleValueDragEnd"
          >
            <div class="drag-handle value-handle">☰</div>
            <input
              :value="value"
              @input="
                updateValue(
                  variable,
                  vIndex,
                  ($event.target as HTMLInputElement).value
                )
              "
              class="live-edit-value"
              placeholder="Value"
            />
            <button
              @click="deleteValue(variable, vIndex)"
              class="delete-value-btn"
            >
              ✕
            </button>
          </div>

          <div v-if="getValues(variable).length === 0" class="empty-values">
            No options yet. Add values above to show them when filling in this
            variable.
          </div>
        </div>
      </div>

      <div
        v-if="stringStore.allTemplateVariables.length === 0"
        class="empty-state"
      >
        <p>No template variables detected.</p>
        <p class="hint">
          Add templates with variables using &#123;&#123; name &#125;&#125;
          syntax, and they will appear here so you can define predefined options
          for each.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStringStore } from '../stores/stringStore';

const stringStore = useStringStore();

const emit = defineEmits<{
  close: [];
}>();

const newValueText = ref('');
const expandedVariable = ref<string | null>(null);
const draggedValueInfo = ref<{
  variable: string;
  valueIndex: number;
} | null>(null);

function getValues(variable: string): string[] {
  const list = stringStore.getValueListByName(variable);
  return list ? list.values : [];
}

function getOrCreateList(variable: string) {
  let list = stringStore.getValueListByName(variable);
  if (!list) {
    list = stringStore.addValueList(variable);
  }
  return list;
}

function toggleExpanded(variable: string) {
  expandedVariable.value =
    expandedVariable.value === variable ? null : variable;
  newValueText.value = '';
}

function addValue(variable: string) {
  if (!newValueText.value.trim()) return;
  const list = getOrCreateList(variable);
  const updatedValues = [...list.values, newValueText.value.trim()];
  stringStore.updateValueList(list.id, { values: updatedValues });
  newValueText.value = '';
}

function updateValue(variable: string, valueIndex: number, newValue: string) {
  const list = stringStore.getValueListByName(variable);
  if (list) {
    const updatedValues = [...list.values];
    updatedValues[valueIndex] = newValue;
    stringStore.updateValueList(list.id, { values: updatedValues });
  }
}

function deleteValue(variable: string, valueIndex: number) {
  const list = stringStore.getValueListByName(variable);
  if (list) {
    const updatedValues = list.values.filter((_, i) => i !== valueIndex);
    if (updatedValues.length === 0) {
      // Remove the value list entirely when empty
      stringStore.removeValueList(list.id);
    } else {
      stringStore.updateValueList(list.id, { values: updatedValues });
    }
  }
}

// Value drag-and-drop
function handleValueDragStart(
  event: DragEvent,
  variable: string,
  valueIndex: number
) {
  draggedValueInfo.value = { variable, valueIndex };
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
  }
}

function handleValueDragOver(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}

function handleValueDrop(
  event: DragEvent,
  variable: string,
  dropIndex: number
) {
  event.preventDefault();
  if (
    !draggedValueInfo.value ||
    draggedValueInfo.value.variable !== variable ||
    draggedValueInfo.value.valueIndex === dropIndex
  ) {
    return;
  }

  const list = stringStore.getValueListByName(variable);
  if (!list) return;

  const values = [...list.values];
  const draggedValue = values[draggedValueInfo.value.valueIndex];
  if (draggedValue === undefined) return;

  values.splice(draggedValueInfo.value.valueIndex, 1);
  values.splice(dropIndex, 0, draggedValue);

  stringStore.updateValueList(list.id, { values });
  draggedValueInfo.value = null;
}

function handleValueDragEnd() {
  draggedValueInfo.value = null;
}
</script>

<style scoped>
.value-list-manager {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 75vh;
  padding: 0;
}

.manager-header {
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

.manager-header h2 {
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

.lists-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0;
}

.list-block {
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.list-header-row {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  gap: 0.75rem;
  transition: background-color 0.2s;
}

.list-header-row:hover {
  background-color: var(--accent-background);
}

.variable-label {
  flex: 1;
  font-weight: 500;
  color: var(--text);
  font-size: 1rem;
}

.value-count {
  flex-shrink: 0;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background: var(--accent);
  color: white;
  border-radius: 11px;
  font-size: 0.75rem;
  font-weight: 600;
}

.no-values {
  color: var(--text-light);
  font-size: 0.8rem;
  font-style: italic;
}

.expand-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-shrink: 0;
}

/* Values section */
.values-section {
  border-top: 1px solid var(--border);
  padding: 0.75rem;
  background: var(--accent-background);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.add-value-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.drag-handle-placeholder {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.live-edit-value {
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--text);
  font-size: 0.9rem;
  border-radius: 4px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-sizing: border-box;
}

.live-edit-value:hover {
  border-color: var(--accent);
}

.live-edit-value:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0.5rem var(--accent-dark);
}

.value-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: move;
}

.drag-handle {
  color: var(--text-light);
  cursor: grab;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.8rem;
  line-height: 1;
}

.value-handle {
  font-size: 0.8rem;
  width: 16px;
  height: 16px;
}

.delete-value-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-shrink: 0;
  transition: color 0.2s;
}

.delete-value-btn:hover {
  color: #dc3545;
}

.add-value-button {
  width: 28px;
  height: 28px;
  padding: 0;
  background: var(--accent);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  transition:
    transform 0.2s,
    opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-shrink: 0;
}

.add-value-button:hover:not(:disabled) {
  transform: scale(1.1);
}

.add-value-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.empty-values {
  padding: 0.5rem;
  color: var(--text-light);
  font-size: 0.85rem;
  font-style: italic;
  text-align: center;
}

.empty-state {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-light);
}

.empty-state p {
  margin: 0 0 0.5rem 0;
}

.hint {
  font-size: 0.85rem;
  font-style: italic;
}

@media (max-width: 768px) {
  .value-list-manager {
    max-height: 85vh;
  }

  .list-header-row {
    padding: 0.5rem;
  }
}
</style>
