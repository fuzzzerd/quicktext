import { ref } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';

export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

// Global state that persists across components and route changes
const sharedData = ref<string | null>(null);
const hasSharedData = ref(false);

export function useShareHandler() {
  function setSharedData(route: RouteLocationNormalized) {
    // Extract share data from URL parameters
    const title = route.query.title as string;
    const text = route.query.text as string;
    const url = route.query.url as string;

    // Format the shared content
    let sharedContent = '';
    if (text) {
      sharedContent = text;
    } else if (title && url) {
      sharedContent = `${title}\n${url}`;
    } else if (title) {
      sharedContent = title;
    } else if (url) {
      sharedContent = url;
    }

    // Set the shared data if we have content
    if (sharedContent) {
      sharedData.value = sharedContent;
      hasSharedData.value = true;
    }
  }

  function consumeSharedData(): string | null {
    if (!sharedData.value) return null;

    const content = sharedData.value;
    sharedData.value = null;
    hasSharedData.value = false;
    return content;
  }

  return {
    sharedData,
    hasSharedData,
    setSharedData,
    consumeSharedData
  };
}
