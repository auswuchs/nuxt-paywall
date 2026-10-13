import { createPaywallApi } from '~/api/PaywallApi'

export default defineNuxtPlugin(() => ({
  provide: {
    api: createPaywallApi($fetch),
  },
}))
