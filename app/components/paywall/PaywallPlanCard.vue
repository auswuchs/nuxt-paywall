<script setup lang="ts">
type Props = {
  offer: Offer
  selected: boolean
}

type Emits = {
  select: [id: OfferId]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const price = computed(() => formatPrice(props.offer.price))
</script>

<template>
  <label
    class="plan"
    :class="{ selected }"
  >
    <input
      class="visually-hidden"
      type="radio"
      name="offer"
      :value="offer.id"
      :checked="selected"
      @change="emit('select', offer.id)"
    />

    <span
      class="radio"
      aria-hidden="true"
    />

    <span class="info">
      <span class="title-row">
        <span class="text-title">{{ offer.title }}</span>
        <span
          v-if="offer.discountPercent"
          class="badge text-badge"
        >
          −{{ offer.discountPercent }}%
        </span>
      </span>
      <span class="note text-caption">{{ offer.note }}</span>
    </span>

    <span class="text-price">{{ price }}</span>
  </label>
</template>

<style scoped>
.plan {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  padding: var(--space-16);
  color: var(--color-ink);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  transition: background-color 0.15s ease-out, border-color 0.15s ease-out;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
}

.plan:has(:focus-visible) {
  outline: 3px solid var(--color-blue);
  outline-offset: 2px;
}

.selected {
  background: var(--color-blue-soft);
  border-color: var(--color-blue);
}

.radio {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--color-surface);
  border: 2px solid var(--color-border-strong);
  border-radius: var(--radius-full);
}

.selected .radio {
  background: var(--color-blue);
  border: 0;
}

.selected .radio::after {
  width: 10px;
  height: 10px;
  background: var(--color-surface);
  border-radius: var(--radius-full);
  content: '';
}

.info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-2);
}

.title-row {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.badge {
  padding: var(--space-2) var(--space-8);
  color: var(--color-surface);
  background: var(--color-pink);
  border-radius: var(--radius-sm);
}

.note {
  color: var(--color-ink-muted);
}
</style>
