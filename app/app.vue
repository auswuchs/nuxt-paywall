<template>
  <div class="container">
    <NuxtPage />
  </div>
</template>

<style scoped>
/* Целевая ширина из ТЗ — 360–430px; на планшете и десктопе экран не растягивается. */
.container {
  max-width: var(--layout-max-width);
  margin-inline: auto;
}
</style>
