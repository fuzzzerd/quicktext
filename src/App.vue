<script setup lang="ts">
import QuickText from './components/QuickText.vue';
import ReloadPrompt from './components/ReloadPrompt.vue';
import AddTextFab from './components/AddTextFab.vue'; // Import the new component
import SettingsPanel from './components/SettingsPanel.vue'; // Import the SettingsPanel component
</script>

<template>
  <header class="container">
    <div class="row">
      <div class="col">
        <h1>Quick Text</h1>
      </div>
      <SettingsPanel class="col" />
    </div>
  </header>

  <main class="container">
    <QuickText />
  </main>

  <AddTextFab />

  <ReloadPrompt />
</template>

<style>
header {
  background-color: var(--accent-background);
}
header h1 {
  margin: 0;
  padding: 0;
  font-size: 1.5rem;
  color: var(--accent);
}

h2 {
  margin: 0;
  color: var(--accent);
}

h3 {
  margin: 0;
  color: var(--accent);
}

main {
  padding-bottom: 4rem; /* Keep padding for FAB and BottomBar */
}
</style>
