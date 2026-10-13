<script setup lang="ts">
type Props = {
  offers: readonly Offer[]
  selectedId?: OfferId
}

type Emits = {
  select: [id: OfferId]
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <fieldset class="plans">
    <legend class="visually-hidden">
      Выберите тариф
    </legend>

    <PaywallPlanCard
      v-for="offer in offers"
      :key="offer.id"
      :offer="offer"
      :selected="offer.id === selectedId"
      @select="emit('select', $event)"
    />
  </fieldset>
</template>

<style scoped>
.plans {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  min-width: 0;
  padding: 0;
  border: 0;
}
</style>
