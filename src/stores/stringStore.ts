import { ref, computed, onMounted, toRaw } from 'vue';
import { defineStore } from 'pinia';
import QuickText from '../models/quickText';
import Category from '../models/category';
import { useSettingsStore } from './settingsStore';
import { StorageManager } from '../storage/StorageManager';

export const useStringStore = defineStore('stringStore', () => {
  const settingsStore = useSettingsStore();
  let storageManager: StorageManager;

  const quickTexts = ref<QuickText[]>([]);
  const categories = ref<Category[]>([]);
  const activeCategoryId = ref<number | null>(null);
  const isInitialized = ref(false);

  const authorizedCategoryId = ref<number | null>(null);

  // Initialize data from storage
  async function initializeStore() {
    if (isInitialized.value) return;

    storageManager = settingsStore.getStorageManager();

    try {
      // Load data from storage
      const [storedQuickTexts, storedCategories, storedActiveCategory] =
        await Promise.all([
          storageManager.get<QuickText[]>('quickTexts'),
          storageManager.get<Category[]>('categories'),
          storageManager.get<number | null>('activeCategoryId')
        ]);

      quickTexts.value = storedQuickTexts || [];
      categories.value = storedCategories || [];
      activeCategoryId.value = storedActiveCategory || null;

      // Try to migrate from localStorage if storage is empty
      if (quickTexts.value.length === 0 && categories.value.length === 0) {
        await migrateFromLocalStorage();
      }

      isInitialized.value = true;
    } catch (error) {
      console.error('Error initializing store:', error);
      // Fallback to localStorage if there's an error
      quickTexts.value = JSON.parse(localStorage.getItem('quickTexts') || '[]');
      categories.value = JSON.parse(localStorage.getItem('categories') || '[]');
      activeCategoryId.value = JSON.parse(
        localStorage.getItem('activeCategoryId') || 'null'
      );
      isInitialized.value = true;
    }
  }

  // Migrate data from localStorage if needed
  async function migrateFromLocalStorage() {
    try {
      const localQuickTexts = JSON.parse(
        localStorage.getItem('quickTexts') || '[]'
      );
      const localCategories = JSON.parse(
        localStorage.getItem('categories') || '[]'
      );
      const localActiveCategory = JSON.parse(
        localStorage.getItem('activeCategoryId') || 'null'
      );

      if (localQuickTexts.length > 0 || localCategories.length > 0) {
        quickTexts.value = localQuickTexts;
        categories.value = localCategories;
        activeCategoryId.value = localActiveCategory;

        // Save to new storage (use toRaw to avoid proxy issues)
        await Promise.all([
          storageManager.set('quickTexts', toRaw(quickTexts.value)),
          storageManager.set('categories', toRaw(categories.value)),
          storageManager.set('activeCategoryId', activeCategoryId.value)
        ]);
      }
    } catch (error) {
      console.error('Error migrating from localStorage:', error);
    }
  }

  function addQuickText(
    text: string,
    sort: number = 0,
    categoryIds?: number[]
  ) {
    const id = Date.now(); // Generate a unique id based on the current timestamp
    const newQuickText = new QuickText(text, sort, id, categoryIds);
    quickTexts.value.push(newQuickText);
    saveToStorage();
  }

  function removeQuickText(text: string) {
    const index = quickTexts.value.findIndex(qt => qt.text === text);
    if (index !== -1) {
      quickTexts.value.splice(index, 1);
      saveToStorage();
    }
  }

  function getQuickTextById(id: number): QuickText | undefined {
    return quickTexts.value.find(qt => qt.id === id);
  }

  function removeQuickTextById(id: number) {
    const index = quickTexts.value.findIndex(qt => qt.id === id);
    if (index !== -1) {
      quickTexts.value.splice(index, 1);
      saveToStorage();
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
        saveToStorage();
      }
    }
  }

  function addCategory(name: string, icon?: string, pin?: string) {
    const id = Date.now();
    const sortOrder = categories.value.length;
    const newCategory = new Category(id, name, sortOrder, icon, pin);
    categories.value.push(newCategory);
    saveCategoriesStorage();
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
        saveCategoriesStorage();
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
      saveToStorage();
      saveCategoriesStorage();
    }
  }

  function reorderCategories(newOrder: Category[]) {
    categories.value = newOrder.map((cat, index) => ({
      ...cat,
      sortOrder: index
    }));
    saveCategoriesStorage();
  }

  function reorderQuickTexts(newOrder: QuickText[]) {
    newOrder.forEach((qt, index) => {
      qt.sort = index;
    });
    quickTexts.value = [...newOrder];
    saveToStorage();
  }

  function setActiveCategory(categoryId: number | null) {
    // Reset authorization when switching categories
    if (categoryId !== activeCategoryId.value) {
      authorizedCategoryId.value = null;
    }
    activeCategoryId.value = categoryId;
    saveActiveCategoryStorage(categoryId);
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
    let filtered: QuickText[] = [];

    if (activeCategoryId.value === null) {
      filtered = quickTexts.value;
    } else if (activeCategoryId.value === -1) {
      // Special case for "uncategorized" - represented by id -1
      filtered = quickTexts.value.filter(
        qt => !qt.categoryIds || qt.categoryIds.length === 0
      );
    } else {
      // Check if category is pin-protected and authorized
      if (!isCategoryAuthorized(activeCategoryId.value)) {
        return []; // Return empty array if category is not authorized
      }

      filtered = quickTexts.value.filter(
        qt => qt.categoryIds && qt.categoryIds.includes(activeCategoryId.value!)
      );
    }

    // Sort by sort property
    return [...filtered].sort((a, b) => a.sort - b.sort);
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

  async function saveToStorage() {
    if (!storageManager) {
      storageManager = settingsStore.getStorageManager();
    }
    try {
      // Use toRaw to get the plain array without Vue reactivity
      const plainQuickTexts = toRaw(quickTexts.value);
      await storageManager.set('quickTexts', plainQuickTexts);
    } catch (error) {
      console.error('Error saving quickTexts:', error);
      // Fallback to localStorage
      localStorage.setItem('quickTexts', JSON.stringify(quickTexts.value));
    }
  }

  async function saveCategoriesStorage() {
    if (!storageManager) {
      storageManager = settingsStore.getStorageManager();
    }
    try {
      // Use toRaw to get the plain array without Vue reactivity
      const plainCategories = toRaw(categories.value);
      await storageManager.set('categories', plainCategories);
    } catch (error) {
      console.error('Error saving categories:', error);
      // Fallback to localStorage
      localStorage.setItem('categories', JSON.stringify(categories.value));
    }
  }

  async function saveActiveCategoryStorage(categoryId: number | null) {
    if (!storageManager) {
      storageManager = settingsStore.getStorageManager();
    }
    try {
      await storageManager.set('activeCategoryId', categoryId);
    } catch (error) {
      console.error('Error saving activeCategoryId:', error);
      // Fallback to localStorage
      localStorage.setItem('activeCategoryId', JSON.stringify(categoryId));
    }
  }

  // Initialize store when it's first used
  onMounted(async () => {
    await initializeStore();
  });

  // Also initialize immediately in case the store is used before mount
  initializeStore();

  return {
    isInitialized,
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
    reorderQuickTexts,
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
