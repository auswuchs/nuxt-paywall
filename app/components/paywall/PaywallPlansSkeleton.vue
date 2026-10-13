<template>
  <div
    class="skeleton"
    aria-busy="true"
    aria-label="Загружаем тарифы"
  >
    <div
      v-for="index in 2"
      :key="index"
      class="card"
    >
      <span class="radio" />
      <span class="info">
        <span class="line title" />
        <span class="line note" />
      </span>
      <span class="line price" />
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.card {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  height: 82px;
  padding: var(--space-16);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
}

.radio,
.line {
  background: var(--color-border);
  animation: pulse 1.2s ease-in-out infinite alternate;
}

.radio {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
}

.info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-8);
}

.line {
  border-radius: 6px;
}

.title {
  width: 96px;
  height: 18px;
}

.note {
  width: 150px;
  height: 14px;
}

.price {
  width: 64px;
  height: 18px;
}

@keyframes pulse {
  to {
    opacity: 0.5;
  }
}
</style>
