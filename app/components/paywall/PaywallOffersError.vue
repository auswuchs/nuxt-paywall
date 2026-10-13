<script setup lang="ts">
type Emits = {
  retry: []
}

const emit = defineEmits<Emits>()
</script>

<template>
  <div
    class="error"
    role="alert"
  >
    <span
      class="icon text-heading"
      aria-hidden="true"
    >
      !
    </span>
    <p class="text-title">
      Не удалось загрузить тарифы
    </p>
    <p class="hint text-caption">
      Проверь интернет и попробуй ещё раз
    </p>
    <button
      class="retry text-link"
      type="button"
      @click="emit('retry')"
    >
      Повторить
    </button>
  </div>
</template>

<style scoped>
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-20);
  text-align: center;
  color: var(--color-ink);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--color-surface);
  background: var(--color-pink);
  border-radius: var(--radius-full);
}

.hint {
  color: var(--color-ink-muted);
}

.retry {
  height: 44px;
  padding: 0 var(--space-20);
  color: var(--color-blue);
  background: var(--color-blue-soft);
  border-radius: var(--radius-lg);
}
</style>
