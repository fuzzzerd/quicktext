<script setup lang="ts">
import QuickText from './components/QuickText.vue';
import BottomBar from './components/BottomBar.vue';
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
  <!-- Use the new component -->

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
  padding-bottom: 100px; /* Keep padding for FAB and BottomBar */
}
</style>
