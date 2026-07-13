import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
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
import { EyeIcon } from '../components/EyeIcon'
import { useAuth } from '../context/AuthProvider'
import { useToast } from '../context/ToastProvider'
import { ApiError, api } from '../lib/api'

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setSessionUser } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verifiedNotice, setVerifiedNotice] = useState<string | null>(null)
  const isFormReady = email.trim().length > 0 && password.length > 0

  useEffect(() => {
    if (searchParams.get('email_verified') === '1') {
      setVerifiedNotice('Your email is verified. Sign in with your password to open your dashboard.')
    }

    try {
      const raw = sessionStorage.getItem('auth_flash')
      if (raw) {
        sessionStorage.removeItem('auth_flash')
        const flash = JSON.parse(raw) as { type?: string; message?: string }
        if (flash.type === 'success' && flash.message) {
          setVerifiedNotice(flash.message)
          showToast(flash.message, 'success')
        }
      }
    } catch {
      // Ignore invalid flash payload.
    }
  }, [searchParams, showToast])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      const message = 'Please enter your email and password.'
      setError(message)
      showToast(message, 'error')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const { user } = await api.signIn({ email: trimmedEmail, password })
      setSessionUser(user)
      navigate('/dashboard')
      showToast('Signed in successfully.', 'success')
    } catch (err) {
      if (err instanceof ApiError && err.code === 'EMAIL_NOT_CONFIRMED') {
        showToast('Please verify your email before signing in.', 'info')
        navigate('/signup/check-email', { state: { email: err.email ?? trimmedEmail } })
        return
      }
      const message = err instanceof ApiError ? err.message : 'Sign-in failed. Please try again.'
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
          <h1 className={authHeadingClass}>Sign in</h1>
          <p className={authSubheadingClass}>Enter your email below to sign in to your account</p>
        </div>

        {verifiedNotice ? (
          <p className={authSuccessClass} role="status">
            {verifiedNotice}
          </p>
        ) : null}

        {error ? (
          <p className={authErrorClass} role="alert">
            {error}
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

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="password" className={authLabelClass}>
              Password<span className={authRequiredClass}>*</span>
            </label>
            <Link to="/forgot-password" className={`${authLinkClass} text-xs`}>
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              disabled={submitting}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`${authInputClass} pr-10`}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[var(--db-muted)] transition-colors duration-200 hover:text-[var(--db-text)]"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        <button type="submit" disabled={submitting || !isFormReady} className={authPrimaryButtonClass}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="text-center text-sm text-[var(--db-muted)]">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className={authLinkClass}>
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
