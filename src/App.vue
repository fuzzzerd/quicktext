<script setup lang="ts">
import TheWelcome from './components/QuickText.vue';
</script>

<template>
  <header>
    <img
      alt="quick text logo"
      class="logo"
      src="./assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <div class="greetings">
        <h1 class="green">Quick Text</h1>
        <h3>
          Save your common text strings or messages to your local storage.
        </h3>
      </div>
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
