export type AuthUser = {
  id: string
  email: string
  emailConfirmed: boolean
  fullName: string | null
}

export type SessionResponse = {
  user: AuthUser | null
}

export type SignUpResponse = {
  email: string
  needsEmailVerification: boolean
  user: AuthUser
}

export type SignInResponse = {
  user: AuthUser
}

export type VerifyResponse = {
  user: AuthUser
}

export type MeResponse = {
  user: {
    id: string
    email: string | undefined
    fullName: string | null
  }
}

export class ApiError extends Error {
  code?: string
  status: number
  email?: string

  constructor(message: string, status: number, code?: string, email?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.email = email
  }
}

function normalizeApiBase(rawValue: string) {
  const raw = rawValue.trim().replace(/\/$/, '')
  if (!raw) return ''

  if (/^https?:\/\//i.test(raw)) {
    return raw
  }

  // Hostnames without a protocol are treated as relative paths by fetch().
  if (!raw.startsWith('/')) {
    return `https://${raw}`
  }

  return raw
}

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL ?? '')

function getApiBaseConfigError(): string | null {
  if (!API_BASE) {
    return import.meta.env.PROD
      ? 'VITE_API_URL is not set on Vercel. Add your Render backend URL (https://your-app.onrender.com).'
      : 'VITE_API_URL is not set. Add it to web/.env.'
  }

  if (API_BASE.includes('.railway.internal') || API_BASE.includes('.internal/')) {
    return 'VITE_API_URL must be your public backend URL (https://your-app.onrender.com), not a private internal hostname.'
  }

  if (import.meta.env.PROD && !API_BASE.startsWith('https://')) {
    return 'VITE_API_URL must start with https:// in production.'
  }

  return null
}

function apiUrl(path: string) {
  return `${API_BASE}${path}`
}

const BACKEND_UNREACHABLE = import.meta.env.PROD
  ? 'Cannot reach the backend API. Check VITE_API_URL on Vercel (must be https://your-app.onrender.com) and CORS_ORIGIN on Render, then redeploy both services.'
  : 'Cannot reach the backend API. Start the server with: cd server && npm run dev'

const REQUEST_TIMEOUT_MS = 15_000

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const configError = getApiBaseConfigError()
  if (configError) {
    throw new ApiError(configError, 0)
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response: Response

  try {
    response = await fetch(apiUrl(path), {
      ...options,
      credentials: 'include',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(
        'Backend request timed out. Check that Render is live and VITE_API_URL points to your .onrender.com URL.',
        0,
      )
    }
    throw new ApiError(BACKEND_UNREACHABLE, 0)
  } finally {
    window.clearTimeout(timeoutId)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw new ApiError(
      response.ok
        ? 'Backend returned an unexpected response. Check VITE_API_URL in web/.env.'
        : BACKEND_UNREACHABLE,
      response.status,
    )
  }

  const data = (await response.json().catch(() => ({}))) as {
    error?: string | number | null
    code?: string
    email?: string
  }

  if (!response.ok) {
    const rawError = data.error
    const normalizedError =
      typeof rawError === 'string'
        ? rawError.trim()
        : rawError == null
          ? ''
          : String(rawError).trim()

    const message =
      !normalizedError || normalizedError === '{}' || normalizedError === '[object Object]'
        ? 'Request failed. Please try again.'
        : normalizedError

    throw new ApiError(message, response.status, data.code, data.email)
  }

  return data as T
}

export const api = {
  getSession() {
    return request<SessionResponse>('/api/auth/session')
  },

  signUp(body: { fullName: string; email: string; password: string }) {
    return request<SignUpResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  signIn(body: { email: string; password: string }) {
    return request<SignInResponse>('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  signOut() {
    return request<{ ok: boolean }>('/api/auth/signout', { method: 'POST' })
  },

  verify(body: {
    code?: string
    token_hash?: string
    token?: string
    type?: string
    accessToken?: string
    refreshToken?: string
  }) {
    return request<VerifyResponse>('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  resendVerification(email: string) {
    return request<{ ok: boolean }>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  forgotPassword(body: { email: string }) {
    return request<{ ok: boolean }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  prepareRecovery(body: {
    code?: string
    token_hash?: string
    token?: string
    accessToken?: string
    refreshToken?: string
  }) {
    return request<{ ok: boolean }>('/api/auth/prepare-recovery', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  resetPassword(body: {
    password: string
    code?: string
    token_hash?: string
    token?: string
    accessToken?: string
    refreshToken?: string
  }) {
    return request<VerifyResponse>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  getMe() {
    return request<MeResponse>('/api/me')
  },

  getHealth() {
    return request<{ ok: boolean; configError: string | null }>('/api/health')
  },
}

export async function getApiConfigError() {
  try {
    const health = await api.getHealth()
    if (!health.ok && health.configError) {
      return health.configError
    }
    return null
  } catch (err) {
    return err instanceof ApiError ? err.message : BACKEND_UNREACHABLE
  }
}
