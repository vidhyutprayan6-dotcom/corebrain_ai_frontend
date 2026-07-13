import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import {
  authErrorClass,
  authHeadingClass,
  authLinkClass,
  authMutedTextClass,
  authSecondaryButtonClass,
  authSuccessClass,
} from '../components/auth/auth-classes'
import { AuthLayout } from '../components/AuthLayout'
import { useAwaitEmailVerification } from '../hooks/useAwaitEmailVerification'
import { useToast } from '../context/ToastProvider'
import { ApiError, api } from '../lib/api'

type CheckEmailLocationState = {
  email?: string
}

export function SignUpCheckEmailPage() {
  const location = useLocation()
  const { showToast } = useToast()
  const state = location.state as CheckEmailLocationState | null
  const email = state?.email
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useAwaitEmailVerification()

  if (!email) {
    return <Navigate to="/signup" replace />
  }

  async function handleResend() {
    if (!email) return

    setResending(true)
    setError(null)
    setMessage(null)

    try {
      await api.resendVerification(email)
      const successMessage = 'Verification email sent again. Open the link to complete your sign-up.'
      setMessage(successMessage)
      showToast(successMessage, 'success')
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Could not resend verification email.'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-5">
        <div className="space-y-1">
          <h1 className={authHeadingClass}>Verify your email</h1>
          <p className={authMutedTextClass}>Sign-up is in progress. We sent a verification link to:</p>
          <p className="text-sm font-medium text-[var(--db-text)]">{email}</p>
        </div>

        <p className={authMutedTextClass}>
          Open the link in that email in a new tab. This page will update automatically and take you to your
          dashboard as soon as verification completes.
        </p>

        <div className="flex items-center gap-3 rounded-xl border border-[var(--db-border)] bg-[var(--db-bg)] px-4 py-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--db-border)] border-t-[var(--db-active-icon)]" />
          <p className="text-sm text-[var(--db-muted)]">Waiting for email verification...</p>
        </div>

        {error ? (
          <p className={authErrorClass} role="alert">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className={authSuccessClass} role="status">
            {message}
          </p>
        ) : null}

        <button type="button" onClick={handleResend} disabled={resending} className={authSecondaryButtonClass}>
          {resending ? 'Sending...' : 'Resend verification email'}
        </button>

        <p className="text-center text-sm text-[var(--db-muted)]">
          Wrong email?{' '}
          <Link to="/signup" className={authLinkClass}>
            Start sign-up again
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
