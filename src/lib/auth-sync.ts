export const AUTH_SYNC_STORAGE_KEY = 'corebrain-auth-verified'
export const AUTH_SYNC_CHANNEL = 'corebrain-auth-sync'

export function notifyVerificationComplete() {
  try {
    const channel = new BroadcastChannel(AUTH_SYNC_CHANNEL)
    channel.postMessage({ type: 'verified', at: Date.now() })
    channel.close()
  } catch {
    // BroadcastChannel may be unavailable in some environments.
  }

  localStorage.setItem(AUTH_SYNC_STORAGE_KEY, String(Date.now()))
  window.setTimeout(() => {
    localStorage.removeItem(AUTH_SYNC_STORAGE_KEY)
  }, 0)
}

export function subscribeToVerificationComplete(callback: () => void) {
  let channel: BroadcastChannel | null = null

  try {
    channel = new BroadcastChannel(AUTH_SYNC_CHANNEL)
    channel.onmessage = (event: MessageEvent<{ type?: string }>) => {
      if (event.data?.type === 'verified') {
        callback()
      }
    }
  } catch {
    // BroadcastChannel may be unavailable in some environments.
  }

  function onStorage(event: StorageEvent) {
    if (event.key === AUTH_SYNC_STORAGE_KEY && event.newValue) {
      callback()
    }
  }

  window.addEventListener('storage', onStorage)

  return () => {
    channel?.close()
    window.removeEventListener('storage', onStorage)
  }
}
