<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';

const UPDATE_CHECK_INTERVAL = 20000; // 20sec

const { needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: true,
  onRegisteredSW(swScriptUrl: string, r: ServiceWorkerRegistration | undefined) {
    console.log(`Refresh Checker: service worker at: ${swScriptUrl}`);

    r &&
      setInterval(async () => {
        console.log('Refresh Checker: checking for update');
        await r.update();
      }, UPDATE_CHECK_INTERVAL);
  }
});

const close = async () => {
  needRefresh.value = false;
};
</script>

<template>
  <div v-if="needRefresh" class="pwa-toast" role="alert">
    <div class="message">
      <span>New content available, click on reload button to update.</span>
    </div>
    <button v-if="needRefresh" type="button" @click="updateServiceWorker()">
      Reload
    </button>
    <button type="button" @click="close()">Close</button>
  </div>
</template>

<style>
.pwa-toast {
  z-index: 200;
  max-width: 350px;
  background: var(--accent-background);
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 0 1rem 75px 1rem;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  text-align: left;
  box-shadow: 3px 4px 5px 0px var(--border);
}
.pwa-toast .message {
  margin: 1rem;
}
</style>
