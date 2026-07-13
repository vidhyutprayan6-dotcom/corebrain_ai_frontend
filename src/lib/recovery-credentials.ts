export type RecoveryCredentials = {
  code?: string
  token_hash?: string
  accessToken?: string
  refreshToken?: string
}

export type ParsedRecoveryLink =
  | { ok: true; credentials: RecoveryCredentials | null }
  | { ok: false; error: string }

export function parseRecoveryLink(search: string, hash: string): ParsedRecoveryLink {
  const searchParams = new URLSearchParams(search)
  const hashParams = new URLSearchParams(hash.replace(/^#/, ''))

  const authError =
    searchParams.get('error_description') ??
    hashParams.get('error_description') ??
    searchParams.get('error') ??
    hashParams.get('error')

  if (authError) {
    return { ok: false, error: decodeURIComponent(authError.replace(/\+/g, ' ')) }
  }

  const code = searchParams.get('code') ?? undefined
  const tokenHash = searchParams.get('token_hash') ?? searchParams.get('token') ?? undefined
  const accessToken = hashParams.get('access_token') ?? undefined
  const refreshToken = hashParams.get('refresh_token') ?? undefined

  if (tokenHash || accessToken || code) {
    return {
      ok: true,
      credentials: {
        code,
        token_hash: tokenHash,
        accessToken,
        refreshToken,
      },
    }
  }

  return { ok: true, credentials: null }
}
