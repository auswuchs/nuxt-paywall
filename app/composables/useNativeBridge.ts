type PaywallEvent
  = | { type: 'close' }
    | { type: 'purchased', entitlement: Entitlement }

declare global {
  interface Window {
    webkit?: { messageHandlers?: { paywall?: { postMessage: (message: PaywallEvent) => void } } }
    Android?: { onPaywallEvent?: (message: string) => void }
  }
}

export function useNativeBridge() {
  function send(event: PaywallEvent) {
    const iosHandler = window.webkit?.messageHandlers?.paywall
    if (iosHandler) {
      iosHandler.postMessage(event)
      return
    }

    window.Android?.onPaywallEvent?.(JSON.stringify(event))
  }

  function close() {
    send({ type: 'close' })
  }

  function notifyPurchased(entitlement: Entitlement) {
    send({ type: 'purchased', entitlement })
  }

  return { close, notifyPurchased }
}
