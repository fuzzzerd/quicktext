<script setup lang="ts">
import QuickText from './components/QuickText.vue';
import BottomBar from './components/BottomBar.vue';
import ReloadPrompt from './components/ReloadPrompt.vue';
</script>

<template>
  <header class="container">
    <div class="row">
      <div class="col">
        <h1>Quick Text</h1>
      </div>
      <div class="col icons">
        <button>...</button>
      </div>
    </div>
  </header>

  <main class="container">
    <QuickText />
  </main>

  <BottomBar />
  <ReloadPrompt />
</template>

<style>
header {
  background-color: var(--accent-background);
  color: var(--accent);
}
header h1 {
  margin: 0;
  padding: 0;
  font-size: 1.5rem;
}

h2 {
  margin: 0;
}

h3 {
  margin: 0;
}

main {
  padding-bottom: 52px;
}
</style>
