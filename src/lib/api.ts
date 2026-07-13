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

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

function apiUrl(path: string) {
  return `${API_BASE}${path}`
}

const BACKEND_UNREACHABLE = import.meta.env.PROD
  ? 'Cannot reach the backend API. Check VITE_API_URL on Vercel and CORS_ORIGIN on Render, then redeploy both services.'
  : 'Cannot reach the backend API. Start the server with: cd server && npm run dev'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(apiUrl(path), {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
  } catch {
    throw new ApiError(BACKEND_UNREACHABLE, 0)
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
    error?: string
    code?: string
    email?: string
  }

  if (!response.ok) {
    throw new ApiError(data.error ?? 'Request failed.', response.status, data.code, data.email)
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
