<script setup lang="ts">
const BENEFITS = [
  '120+ уровней и новые каждую неделю',
  'Никакой рекламы',
  'Можно играть без интернета',
]
</script>

<template>
  <ul class="benefits">
    <li
      v-for="benefit in BENEFITS"
      :key="benefit"
      class="benefit text-body"
    >
      <span class="icon">
        <IconCheck />
      </span>
      {{ benefit }}
    </li>
  </ul>
</template>

<style scoped>
.benefits {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  padding: 0;
  list-style: none;
}

.benefit {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  color: var(--color-ink);
}

.icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--color-green);
  background: var(--color-green-soft);
  border-radius: var(--radius-full);
}
</style>
