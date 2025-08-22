<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useShareHandler } from '@/composables/useShareHandler';

const router = useRouter();
const route = useRoute();
const { setSharedData } = useShareHandler();

onMounted(async () => {
  // Process the route and set shared data
  setSharedData(route);

  // Wait for Vue to process the reactive update
  await nextTick();

  // Redirect to home
  router.replace('/');
});
</script>

<template>
  <div class="share-receiver">
    <div class="container">
      <div class="loading">
        <h2>Processing shared content...</h2>
        <p>Redirecting to home...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.share-receiver {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
}

.loading h2 {
  color: var(--accent);
  margin-bottom: 1rem;
}

.loading p {
  color: var(--text);
  opacity: 0.8;
}
</style>
