import type { AuthUser } from './api'

const AUTH_CACHE_KEY = 'corebrain-session-user'

export function readCachedUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.sessionStorage.getItem(AUTH_CACHE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed?.id || typeof parsed.email !== 'string') {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export function writeCachedUser(user: AuthUser | null) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    if (!user) {
      window.sessionStorage.removeItem(AUTH_CACHE_KEY)
      return
    }

    window.sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(user))
  } catch {
    // Ignore storage quota or privacy mode errors.
  }
}
