<script setup lang="ts">
type Props = {
  offerTitle?: string
}

defineProps<Props>()
</script>

<template>
  <div
    class="success"
    role="status"
  >
    <span class="icon">
      <IconCheckLarge class="check" />
    </span>
    <p class="text-display">
      Готово!
    </p>
    <p
      v-if="offerTitle"
      class="details text-body"
    >
      Тариф «{{ offerTitle }}» активирован
    </p>
  </div>
</template>

<style scoped>
.success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-24) var(--space-20);
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
  width: 72px;
  height: 72px;
  color: var(--color-green);
  background: var(--color-green-soft);
  border-radius: var(--radius-full);
}

/* В макете галочка — глиф шрифта, он сидит ниже геометрического центра. */
.check {
  transform: translateY(1px);
}

.details {
  color: var(--color-ink-muted);
}
</style>
