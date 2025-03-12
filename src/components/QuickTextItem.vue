<template>
  <div class="row">
    <div class="col col-medium">
      <slot></slot>
    </div>
    <div class="col col-small icons">
      <slot name="icon"></slot>
    </div>
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

.icons {
  display: flex;
  width: 100px;
}
</style>
