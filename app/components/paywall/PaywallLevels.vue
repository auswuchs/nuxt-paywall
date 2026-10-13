<script setup lang="ts">
type Props = {
  unlocked: boolean
}

const props = defineProps<Props>()

const TOTAL_LEVELS = 12
const FREE_LEVELS = 3

const levels = computed(() =>
  Array.from({ length: TOTAL_LEVELS }, (_, index) => ({
    number: index + 1,
    open: props.unlocked || index < FREE_LEVELS,
  })),
)
</script>

<template>
  <ol
    class="levels"
    aria-label="Уровни"
  >
    <li
      v-for="level in levels"
      :key="level.number"
      class="level text-heading"
      :class="{ locked: !level.open }"
    >
      <template v-if="level.open">
        {{ level.number }}
      </template>
      <template v-else>
        <IconLock />
        <span class="visually-hidden">Уровень {{ level.number }} закрыт</span>
      </template>
    </li>
  </ol>
</template>

<style scoped>
.levels {
  display: grid;
  grid-template-columns: repeat(4, 48px);
  gap: var(--space-8);
  padding: 0;
  list-style: none;
}

.level {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  color: var(--color-ink);
  background: var(--color-surface);
  border-radius: var(--radius-md);
}

.locked {
  color: var(--color-sun-ink);
  background: var(--color-sun-deep);
}
</style>
