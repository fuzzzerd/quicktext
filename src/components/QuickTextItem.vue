<template>
  <div class="item">
    <div class="details">
      <slot></slot>
    </div>
    <i>
      <slot name="icon"></slot>
    </i>
  </div>
</template>

<style scoped>
.item {
  margin-top: 2rem;
  display: flex;
  position: relative;
}

.details {
  flex: 1;
  margin-left: 1rem;
}

</style>
