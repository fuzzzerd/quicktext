import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import QuickText from '../models/quickText';
import Category from '../models/category';

export const useStringStore = defineStore('stringStore', () => {
  const quickTexts = ref<QuickText[]>(
    JSON.parse(localStorage.getItem('quickTexts') || '[]')
  );

  const categories = ref<Category[]>(
    JSON.parse(localStorage.getItem('categories') || '[]')
  );

  const activeCategoryId = ref<number | null>(
    JSON.parse(localStorage.getItem('activeCategoryId') || 'null')
  );

  const authorizedCategoryId = ref<number | null>(null);

  function addQuickText(
    text: string,
    sort: number = 0,
    categoryIds?: number[]
  ) {
    const id = Date.now(); // Generate a unique id based on the current timestamp
    const newQuickText = new QuickText(text, sort, id, categoryIds);
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

  function updateQuickText(
    id: number,
    updates: Partial<Omit<QuickText, 'id'>>
  ) {
    const index = quickTexts.value.findIndex(qt => qt.id === id);
    if (index !== -1) {
      const existing = quickTexts.value[index];
      if (existing) {
        quickTexts.value[index] = {
          text: existing.text,
          sort: existing.sort,
          id: existing.id,
          categoryIds: existing.categoryIds,
          ...updates
        };
        saveToLocalStorage();
      }
    }
  }

  function addCategory(name: string, icon?: string, pin?: string) {
    const id = Date.now();
    const sortOrder = categories.value.length;
    const newCategory = new Category(id, name, sortOrder, icon, pin);
    categories.value.push(newCategory);
    saveCategoriesLocalStorage();
    return newCategory;
  }

  function updateCategory(id: number, updates: Partial<Omit<Category, 'id'>>) {
    const index = categories.value.findIndex(c => c.id === id);
    if (index !== -1) {
      const existing = categories.value[index];
      if (existing) {
        categories.value[index] = {
          id: existing.id,
          name: existing.name,
          sortOrder: existing.sortOrder,
          icon: existing.icon,
          pin: existing.pin,
          ...updates
        };
        saveCategoriesLocalStorage();
      }
    }
  }

  function removeCategory(id: number) {
    const index = categories.value.findIndex(c => c.id === id);
    if (index !== -1) {
      categories.value.splice(index, 1);
      // Remove category from all quickTexts
      quickTexts.value.forEach(qt => {
        if (qt.categoryIds) {
          qt.categoryIds = qt.categoryIds.filter(catId => catId !== id);
        }
      });
      // Reset active category if it was the deleted one
      if (activeCategoryId.value === id) {
        activeCategoryId.value = null;
      }
      saveToLocalStorage();
      saveCategoriesLocalStorage();
    }
  }

  function reorderCategories(newOrder: Category[]) {
    categories.value = newOrder.map((cat, index) => ({
      ...cat,
      sortOrder: index
    }));
    saveCategoriesLocalStorage();
  }

  function setActiveCategory(categoryId: number | null) {
    // Reset authorization when switching categories
    if (categoryId !== activeCategoryId.value) {
      authorizedCategoryId.value = null;
    }
    activeCategoryId.value = categoryId;
    localStorage.setItem('activeCategoryId', JSON.stringify(categoryId));
  }

  function authorizeCategory(categoryId: number) {
    authorizedCategoryId.value = categoryId;
  }

  function isCategoryAuthorized(categoryId: number): boolean {
    const category = categories.value.find(c => c.id === categoryId);
    if (!category || !category.pin) {
      return true; // No pin required
    }
    return authorizedCategoryId.value === categoryId;
  }

  function validateCategoryPin(
    categoryId: number,
    enteredPin: string
  ): boolean {
    const category = categories.value.find(c => c.id === categoryId);
    if (!category || !category.pin) {
      return true; // No pin required
    }
    return category.pin === enteredPin;
  }

  function getCategoryById(id: number): Category | undefined {
    return categories.value.find(c => c.id === id);
  }

  const filteredQuickTexts = computed(() => {
    if (activeCategoryId.value === null) {
      return quickTexts.value;
    }

    // Special case for "uncategorized" - represented by id -1
    if (activeCategoryId.value === -1) {
      return quickTexts.value.filter(
        qt => !qt.categoryIds || qt.categoryIds.length === 0
      );
    }

    // Check if category is pin-protected and authorized
    if (!isCategoryAuthorized(activeCategoryId.value)) {
      return []; // Return empty array if category is not authorized
    }

    return quickTexts.value.filter(
      qt => qt.categoryIds && qt.categoryIds.includes(activeCategoryId.value!)
    );
  });

  const sortedCategories = computed(() => {
    return [...categories.value].sort((a, b) => a.sortOrder - b.sortOrder);
  });

  const hasUncategorizedItems = computed(() => {
    return quickTexts.value.some(
      qt => !qt.categoryIds || qt.categoryIds.length === 0
    );
  });

  const shouldShowCategoryTabs = computed(() => {
    // Only show bottom bar if there are categories defined
    return categories.value.length > 0;
  });

  const isActiveCategoryLocked = computed(() => {
    if (activeCategoryId.value === null || activeCategoryId.value === -1) {
      return false;
    }
    return !isCategoryAuthorized(activeCategoryId.value);
  });

  function saveToLocalStorage() {
    localStorage.setItem('quickTexts', JSON.stringify(quickTexts.value));
  }

  function saveCategoriesLocalStorage() {
    localStorage.setItem('categories', JSON.stringify(categories.value));
  }

  return {
    quickTexts,
    categories,
    activeCategoryId,
    filteredQuickTexts,
    sortedCategories,
    hasUncategorizedItems,
    shouldShowCategoryTabs,
    isActiveCategoryLocked,
    addQuickText,
    removeQuickText,
    getQuickTextById,
    removeQuickTextById,
    updateQuickText,
    addCategory,
    updateCategory,
    removeCategory,
    reorderCategories,
    setActiveCategory,
    authorizeCategory,
    isCategoryAuthorized,
    validateCategoryPin,
    getCategoryById
  };
});
