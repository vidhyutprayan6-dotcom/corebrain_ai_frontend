import { Navigate, useLocation } from 'react-router-dom'

export function AuthCallbackRedirect() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''))

  const hasAuthCallback =
    searchParams.has('code') ||
    searchParams.has('token_hash') ||
    searchParams.has('token') ||
    searchParams.has('type') ||
    hashParams.has('access_token') ||
    hashParams.has('error') ||
    hashParams.has('error_description')

  const verifyType = searchParams.get('type') ?? hashParams.get('type')

  if (hasAuthCallback && verifyType === 'recovery') {
    return <Navigate to={`/reset-password${location.search}${location.hash}`} replace />
  }

  if (hasAuthCallback) {
    return <Navigate to={`/signup/verify${location.search}${location.hash}`} replace />
  }

  return <Navigate to="/login" replace />
}
