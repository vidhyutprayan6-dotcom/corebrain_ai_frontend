import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  authErrorClass,
  authHeadingClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
  authPrimaryButtonClass,
  authRequiredClass,
  authSubheadingClass,
  authSuccessClass,
} from '../components/auth/auth-classes'
import { AuthLayout } from '../components/AuthLayout'
import { useToast } from '../context/ToastProvider'
import { ApiError, api } from '../lib/api'

export function ForgotPasswordPage() {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const isFormReady = email.trim().length > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      const message = 'Please enter your email address.'
      setError(message)
      showToast(message, 'error')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await api.forgotPassword({ email: trimmedEmail })
      setSent(true)
      showToast('If an account exists, a reset link was sent to your email.', 'success')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not send reset email. Please try again.'
      setError(message)
      showToast(message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <h1 className={authHeadingClass}>Reset your password</h1>
          <p className={authSubheadingClass}>
            Enter the email you used to sign up. We&apos;ll send you a link to choose a new password.
          </p>
        </div>

        {error ? (
          <p className={authErrorClass} role="alert">
            {error}
          </p>
        ) : null}

        {sent ? (
          <p className={authSuccessClass} role="status">
            Check your inbox for a password reset link. If you don&apos;t see it, check your spam folder.
          </p>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="email" className={authLabelClass}>
            Email<span className={authRequiredClass}>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={submitting}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={authInputClass}
          />
        </div>

        <button type="submit" disabled={submitting || !isFormReady} className={authPrimaryButtonClass}>
          {submitting ? 'Sending...' : 'Send reset link'}
        </button>

        <p className="text-center text-sm text-[var(--db-muted)]">
          Remember your password?{' '}
          <Link to="/login" className={authLinkClass}>
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
