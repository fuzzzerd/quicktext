<script setup lang="ts">
import QuickText from './components/QuickText.vue';
import BottomBar from './components/BottomBar.vue';
</script>

<template>
  <header class="container">
    <div class="row">
      <div class="col col-small">
        <h1>Quick Text</h1>
      </div>
    </div>
  </header>

  <main class="container">
    <QuickText />
  </main>

  <BottomBar />
</template>

<style scoped>
h1 { margin: 0; }
h2 { margin: 0; }
h3 { margin: 0; }

main {
  padding-bottom: 52px;
}
</style>
