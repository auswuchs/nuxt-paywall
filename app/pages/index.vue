<script setup lang="ts">
import { PaywallView, PurchaseStatus, RestoreStatus } from '~/types/PaywallState'

const {
  offers,
  view,
  selectedOffer,
  purchasedOffer,
  purchaseStatus,
  restoreStatus,
  selectOffer,
  reloadOffers,
  purchase,
  restore,
} = usePaywall()
const { close } = useNativeBridge()

const isSuccess = computed(() => view.value === PaywallView.Success)

const ctaLabel = computed(() => {
  if (isSuccess.value) return 'Играть'
  if (view.value === PaywallView.Loading) return 'Загружаем тарифы…'
  if (purchaseStatus.value === PurchaseStatus.Pending) return 'Оформляем покупку…'
  if (view.value === PaywallView.Ready && selectedOffer.value) {
    return `Продолжить за ${formatPrice(selectedOffer.value.price)}`
  }
  return 'Продолжить'
})

const ctaDisabled = computed(() =>
  !isSuccess.value && (view.value !== PaywallView.Ready || purchaseStatus.value === PurchaseStatus.Pending),
)

const note = computed(() => {
  if (isSuccess.value) return 'Это была тестовая покупка — деньги не списаны'
  if (purchaseStatus.value === PurchaseStatus.Failed) return 'Не удалось оформить покупку. Попробуй ещё раз'
  if (restoreStatus.value === RestoreStatus.NotFound) return 'Активных покупок на этом устройстве нет'
  if (restoreStatus.value === RestoreStatus.Failed) return 'Не удалось проверить покупки. Попробуй ещё раз'
  return 'Тестовая оплата — деньги не спишутся'
})

const noteIsError = computed(() =>
  purchaseStatus.value === PurchaseStatus.Failed || restoreStatus.value === RestoreStatus.Failed,
)

function onCta() {
  if (isSuccess.value) close()
  else purchase()
}
</script>

<template>
  <div class="paywall">
    <PaywallHero
      :unlocked="isSuccess"
      @close="close"
    />

    <main
      class="sheet"
      :class="{ 'sheet-success': isSuccess }"
    >
      <div
        class="content"
        :class="{ centered: isSuccess }"
      >
        <PaywallSuccess
          v-if="isSuccess"
          :offer-title="purchasedOffer?.title"
        />
        <template v-else>
          <PaywallBenefits />
          <PaywallPlansSkeleton v-if="view === PaywallView.Loading" />
          <PaywallOffersError
            v-else-if="view === PaywallView.Error"
            @retry="reloadOffers()"
          />
          <PaywallPlans
            v-else
            :offers="offers"
            :selected-id="selectedOffer?.id"
            @select="selectOffer"
          />
        </template>
      </div>

      <PaywallActions
        :cta-label="ctaLabel"
        :cta-disabled="ctaDisabled"
        :show-restore="!isSuccess"
        :restore-pending="restoreStatus === RestoreStatus.Pending"
        :note="note"
        :note-is-error="noteIsError"
        @cta="onCta"
        @restore="restore"
      />
    </main>
  </div>
</template>

<style scoped>
.paywall {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.sheet {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-12);
  padding: var(--space-24) var(--space-20) calc(var(--space-24) + env(safe-area-inset-bottom));
  background: var(--color-sheet);
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: var(--space-20);
}

.sheet-success {
  gap: 0;
}

.centered {
  flex: 1;
  justify-content: center;
}
</style>
