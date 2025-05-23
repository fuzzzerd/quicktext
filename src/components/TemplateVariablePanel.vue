<script setup lang="ts">
import SlidingPanel from './SlidingPanel.vue';
import { ref, watch } from 'vue';

interface Props {
  isVisible: boolean;
  templateText: string;
  actionType: 'copy' | 'share';
  templateVariables: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  execute: [variableValues: Record<string, string>];
}>();

const variableValues = ref<Record<string, string>>({});

// Reset values when panel becomes visible
watch(
  () => props.isVisible,
  newVisible => {
    if (newVisible) {
      const newValues: Record<string, string> = {};
      props.templateVariables.forEach(variable => {
        newValues[variable] = '';
      });
      variableValues.value = newValues;
    }
  }
);

function handleExecute() {
  emit('execute', variableValues.value);
}

function handleClose() {
  emit('close');
}
</script>

<template>
  <SlidingPanel :is-visible="isVisible" @close="handleClose">
    <div class="template-form">
      <h3>Fill Template Variables</h3>
      <div class="variable-inputs">
        <div
          v-for="variable in templateVariables"
          :key="variable"
          class="variable-input"
        >
          <label :for="variable">{{ variable }}</label>
          <input
            :id="variable"
            type="text"
            v-model="variableValues[variable]"
            :placeholder="`Enter ${variable}...`"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <button class="secondary" @click="handleClose">Cancel</button>
        </div>
        <div class="col">
          <button class="primary" @click="handleExecute">
            {{ actionType === 'copy' ? 'Copy' : 'Share' }}
          </button>
        </div>
      </div>
    </div>
  </SlidingPanel>
</template>

<style scoped>
.template-form {
  padding: 1rem;
}

.template-form h3 {
  margin: 0 0 1rem 0;
  color: var(--accent);
}

.variable-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.variable-input {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.variable-input label {
  font-weight: 500;
  color: var(--accent);
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
</style>
