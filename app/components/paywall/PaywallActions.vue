<script setup lang="ts">
type Props = {
  ctaLabel: string
  ctaDisabled?: boolean
  showRestore?: boolean
  restorePending?: boolean
  note: string
  noteIsError?: boolean
}

type Emits = {
  cta: []
  restore: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <div class="actions">
    <PaywallPrimaryButton
      :disabled="ctaDisabled"
      @click="emit('cta')"
    >
      {{ ctaLabel }}
    </PaywallPrimaryButton>
    <button
      v-if="showRestore"
      class="restore text-link"
      type="button"
      :disabled="restorePending"
      @click="emit('restore')"
    >
      {{ restorePending ? 'Проверяем покупки…' : 'Восстановить покупки' }}
    </button>
    <p
      class="note text-footnote"
      :class="{ error: noteIsError }"
      aria-live="polite"
    >
      {{ note }}
    </p>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.restore {
  height: 44px;
  padding: 0 var(--space-12);
  color: var(--color-blue);
}

.restore:disabled {
  color: var(--color-ink-muted);
  cursor: default;
}

.note {
  text-align: center;
  color: var(--color-ink-muted);
}

.error {
  color: var(--color-pink-text);
}
</style>
