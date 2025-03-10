import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useStringStore = defineStore('stringStore', () => {
  const strings = ref<string[]>(
    JSON.parse(localStorage.getItem('strings') || '[]')
  );

  function addString(newString: string) {
    strings.value.push(newString);
    saveToLocalStorage();
  }

  function removeString(index: number) {
    strings.value.splice(index, 1);
    saveToLocalStorage();
  }

  function saveToLocalStorage() {
    localStorage.setItem('strings', JSON.stringify(strings.value));
  }

  return { strings, addString, removeString };
});
