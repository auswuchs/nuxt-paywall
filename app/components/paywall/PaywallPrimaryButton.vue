<script setup lang="ts">
type Props = {
  disabled?: boolean
}

defineProps<Props>()
</script>

<template>
  <button
    class="button"
    type="button"
    :disabled="disabled"
  >
    <span class="face text-title">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.button {
  align-self: stretch;
  padding-bottom: var(--space-4);
}

/* Нижняя «ступенька» как в Figma — тень того же радиуса, при нажатии кнопка на неё «опускается». */
.face {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  color: var(--color-surface);
  background: var(--color-blue);
  border-radius: var(--radius-lg);
  box-shadow: 0 var(--space-4) 0 var(--color-blue-deep);
  transition: transform 0.1s ease-out, box-shadow 0.1s ease-out;
}

.button:active:not(:disabled) .face {
  box-shadow: 0 0 0 var(--color-blue-deep);
  transform: translateY(var(--space-4));
}

.button:focus-visible {
  outline: none;
}

.button:focus-visible .face {
  outline: 3px solid var(--color-blue-deep);
  outline-offset: 2px;
}

.button:disabled {
  cursor: default;
}

.button:disabled .face {
  color: var(--color-ink-muted);
  background: var(--color-border);
  box-shadow: 0 var(--space-4) 0 var(--color-border-strong);
}
</style>
