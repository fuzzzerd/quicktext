<script setup lang="ts">
import TheWelcome from './components/QuickText.vue';
</script>

<template>
  <header class="container">
    <div class="row">
      <div class="col col-small">
        <h1>Quick Text</h1>
      </div>
    </div>
    <div class="row">
      <div class="col col-large">
        <p>Save your common text strings or messages to your local storage.</p>
      </div>
    </div>
  </header>

  <main class="container">
    <TheWelcome />
  </main>
</template>

<style scoped>
h1 { margin: 0; }
h2 { margin: 0; }
h3 { margin: 0; }
</style>
