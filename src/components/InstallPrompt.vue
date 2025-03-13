<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Variable to stash the `BeforeInstallPromptEvent`.
let installEvent: any = null;

const appCanInstall = computed(() => {
  // Only relevant for browsers that support installation.
  return 'BeforeInstallPromptEvent' in window;
});

const appInstalled = ref(
  window.matchMedia('(display-mode: standalone)').matches
);
const mediaQuery = window.matchMedia('(display-mode: standalone)');
mediaQuery.addEventListener(
  'change',
  (event) => (appInstalled.value = event.matches)
);

// Function that will be run when the app is installed.
const onInstall = () => {
  appInstalled.value = true;
  // No longer needed.
  installEvent = null;
};

onMounted(() => {
  // Only relevant for browsers that support installation.
  if (appCanInstall.value) {
    window.addEventListener('beforeinstallprompt', (event) => {
      // Do not show the install prompt quite yet.
      event.preventDefault();
      // Stash the `BeforeInstallPromptEvent` for later.
      installEvent = event;
      // Enable the install button.
      appInstalled.value = true;
    });

    // The user can decide to ignore the install button
    // and just use the browser prompt directly. In this case
    // likewise run `onInstall()`.
    window.addEventListener('appinstalled', () => {
      onInstall();
    });
  }
});

async function installClicked() {
  // If there is no stashed `BeforeInstallPromptEvent`, return.
  if (!installEvent) {
    return;
  }
  // Use the stashed `BeforeInstallPromptEvent` to prompt the user.
  installEvent.prompt();
  const result = await installEvent.userChoice;
  // If the user installs the app, run `onInstall()`.
  if (result.outcome === 'accepted') {
    onInstall();
  }
}
</script>

<template>
  <button v-if="appCanInstall && !appInstalled" @click="installClicked">
    Install
  </button>
</template>
