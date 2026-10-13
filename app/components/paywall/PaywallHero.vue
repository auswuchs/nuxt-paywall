<script setup lang="ts">
type Props = {
  unlocked: boolean
}

type Emits = {
  close: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <header class="hero">
    <div class="top-bar">
      <button
        class="close"
        type="button"
        aria-label="Закрыть"
        @click="emit('close')"
      >
        <IconClose />
      </button>
    </div>

    <PaywallLevels :unlocked="unlocked" />

    <div class="heading">
      <h1 class="text-display">
        {{ unlocked ? 'Все уровни открыты!' : 'Открой все уровни!' }}
      </h1>
      <p class="subtitle text-body">
        {{ unlocked ? 'Спасибо! Можно играть' : 'Полный доступ к игре без ограничений' }}
      </p>
    </div>
  </header>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-12);
  padding: calc(var(--space-8) + env(safe-area-inset-top)) var(--space-20) var(--space-24);
}

.top-bar {
  display: flex;
  align-self: stretch;
  justify-content: flex-end;
}

.close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--color-ink);
  background: var(--color-overlay-white);
  border-radius: var(--radius-full);
}

.heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding-top: var(--space-4);
  text-align: center;
  text-wrap: balance;
}

.subtitle {
  color: var(--color-sun-text);
}
</style>
