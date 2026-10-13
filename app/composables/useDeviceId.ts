const STORAGE_KEY = 'paywall:device-id'
const MIN_LENGTH = 8

function readOrCreateStoredId() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return stored

    const created = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, created)
    return created
  } catch {
    // В некоторых webview localStorage отключён — живём с id на одну сессию.
    return crypto.randomUUID()
  }
}

export function useDeviceId() {
  const route = useRoute()
  const deviceId = useState('device-id', () => '')

  if (import.meta.client && !deviceId.value) {
    const fromHostApp = route.query.deviceId
    deviceId.value = typeof fromHostApp === 'string' && fromHostApp.length >= MIN_LENGTH
      ? fromHostApp
      : readOrCreateStoredId()
  }

  return readonly(deviceId)
}
