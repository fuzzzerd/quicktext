<script setup lang="ts">
import SlidingPanel from './SlidingPanel.vue';
import { ref, watch } from 'vue';
import { useStringStore } from '../stores/stringStore';

interface Props {
  isVisible: boolean;
  categoryName: string;
  categoryId: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  success: [];
}>();

const stringStore = useStringStore();
const enteredPin = ref('');
const errorMessage = ref('');

watch(
  () => props.isVisible,
  newVisible => {
    if (newVisible) {
      enteredPin.value = '';
      errorMessage.value = '';
    }
  }
);

function handleSubmit() {
  if (enteredPin.value.length === 0) {
    errorMessage.value = 'Please enter a PIN';
    return;
  }

  if (stringStore.validateCategoryPin(props.categoryId, enteredPin.value)) {
    emit('success');
  } else {
    errorMessage.value = 'Incorrect PIN';
    enteredPin.value = '';
  }
}

function handleClose() {
  emit('close');
}

function handleKeyup(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleSubmit();
  }
}
</script>

<template>
  <SlidingPanel :is-visible="isVisible" @close="handleClose">
    <div class="pin-form" role="dialog" aria-label="Category PIN">
      <h3>Enter PIN</h3>
      <p class="category-name">{{ categoryName }}</p>
      <p class="pin-description">
        This PIN only controls viewing this category's contents. It doesn't
        provide encryption or secure storage.
      </p>

      <div class="pin-input-container">
        <input
          v-model="enteredPin"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="one-time-code"
          data-lpignore="true"
          data-1p-ignore="true"
          data-form-type="other"
          placeholder="Enter PIN..."
          @keyup="handleKeyup"
          autofocus
          class="pin-input pin-mask"
        />
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      </div>

      <div class="row">
        <div class="col">
          <button class="secondary" @click="handleClose">Cancel</button>
        </div>
        <div class="col">
          <button class="primary" @click="handleSubmit">Access Category</button>
        </div>
      </div>
    </div>
  </SlidingPanel>
</template>

<style scoped>
.pin-form {
  padding: 1rem;
}

.pin-form h3 {
  margin: 0 0 0.5rem 0;
  color: var(--accent);
}

.category-name {
  font-weight: 600;
  color: var(--text);
  margin: 0 0 1rem 0;
}

.pin-description {
  font-size: 0.9rem;
  color: var(--text-light);
  margin: 0 0 1.5rem 0;
  line-height: 1.4;
}

.pin-input-container {
  margin-bottom: 1.5rem;
}

.pin-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--background);
  color: var(--text);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.pin-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0.5rem var(--accent-dark);
}

/* Mask PIN input to show dots */
.pin-mask {
  -webkit-text-security: disc;
  font-family: text-security-disc;
  letter-spacing: 0.2em;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.5rem;
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
