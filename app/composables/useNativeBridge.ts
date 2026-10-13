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
      return true
    }

    if (window.Android?.onPaywallEvent) {
      window.Android.onPaywallEvent(JSON.stringify(event))
      return true
    }

    return false
  }

  function close() {
    // Вне приложения моста нет — ведём себя как обычная страница.
    if (!send({ type: 'close' }) && window.history.length > 1) window.history.back()
  }

  function notifyPurchased(entitlement: Entitlement) {
    send({ type: 'purchased', entitlement })
  }

  return { close, notifyPurchased }
}
