import { ref } from 'vue';
import { defineStore } from 'pinia';
import QuickText from '../models/quickText';

export const useStringStore = defineStore('stringStore', () => {
  const quickTexts = ref<QuickText[]>(
    JSON.parse(localStorage.getItem('quickTexts') || '[]')
  );

  function addQuickText(text: string, sort: number = 0) {
    const id = Date.now(); // Generate a unique id based on the current timestamp
    const newQuickText = new QuickText(text, sort, id);
    quickTexts.value.push(newQuickText);
    saveToLocalStorage();
  }

  function removeQuickText(text: string) {
    const index = quickTexts.value.findIndex(qt => qt.text === text);
    if (index !== -1) {
      quickTexts.value.splice(index, 1);
      saveToLocalStorage();
    }
  }

  function getQuickTextById(id: number): QuickText | undefined {
    return quickTexts.value.find(qt => qt.id === id);
  }

  function removeQuickTextById(id: number) {
    const index = quickTexts.value.findIndex(qt => qt.id === id);
    if (index !== -1) {
      quickTexts.value.splice(index, 1);
      saveToLocalStorage();
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem('quickTexts', JSON.stringify(quickTexts.value));
  }

  return { quickTexts, addQuickText, removeQuickText, getQuickTextById, removeQuickTextById };
});
