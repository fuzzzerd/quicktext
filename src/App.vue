<script setup lang="ts">
</script>

<template>
  <RouterView />
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
  padding-bottom: 5rem; /* Padding for FAB and BottomBar */
}
</style>
