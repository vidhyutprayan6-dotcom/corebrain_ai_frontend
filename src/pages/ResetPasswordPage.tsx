import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  authActionStackClass,
  authErrorClass,
  authHeadingClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
  authPrimaryButtonClass,
  authRequiredClass,
  authSecondaryButtonClass,
  authSubheadingClass,
} from '../components/auth/auth-classes'
import { AuthLayout } from '../components/AuthLayout'
import { EyeIcon } from '../components/EyeIcon'
import { useAuth } from '../context/AuthProvider'
import { useToast } from '../context/ToastProvider'
import { ApiError, api } from '../lib/api'
import { parseRecoveryLink, type RecoveryCredentials } from '../lib/recovery-credentials'

type ResetStatus = 'loading' | 'ready' | 'invalid' | 'submitting'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { setSessionUser } = useAuth()
  const { showToast } = useToast()
  const preparationStartedRef = useRef(false)
  const recoveryCredentialsRef = useRef<RecoveryCredentials | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [status, setStatus] = useState<ResetStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [sessionReady, setSessionReady] = useState(false)

  const isFormReady = password.length >= 8 && confirmPassword.length > 0

  useEffect(() => {
    if (preparationStartedRef.current) {
      return
    }
    preparationStartedRef.current = true

    let mounted = true

    async function prepareReset() {
      try {
        const { user } = await api.getSession()
        if (user) {
          if (!mounted) return
          setSessionReady(true)
          setStatus('ready')
          window.history.replaceState({}, document.title, '/reset-password')
          return
        }
      } catch {
        // Continue with link verification below.
      }

      const parsed = parseRecoveryLink(window.location.search, window.location.hash)

      if (parsed.ok === false) {
        if (!mounted) return
        setStatus('invalid')
        setError(parsed.error)
        return
      }

      if (parsed.credentials) {
        recoveryCredentialsRef.current = parsed.credentials
        const credentials = parsed.credentials

        try {
          await api.prepareRecovery({
            code: credentials.code,
            token_hash: credentials.token_hash,
            accessToken: credentials.accessToken,
            refreshToken: credentials.refreshToken,
          })

          if (!mounted) return
          recoveryCredentialsRef.current = null
          setSessionReady(true)
          setStatus('ready')
          window.history.replaceState({}, document.title, '/reset-password')
        } catch (err) {
          if (!mounted) return
          setStatus('invalid')
          setError(err instanceof ApiError ? err.message : 'This reset link is invalid or has expired.')
        }
        return
      }

      try {
        await api.prepareRecovery({})
        const { user } = await api.getSession()
        if (!user) {
          if (!mounted) return
          setStatus('invalid')
          setError('This reset link is invalid or has expired. Request a new one from the sign-in page.')
          return
        }

        if (!mounted) return
        setSessionReady(true)
        setStatus('ready')
        window.history.replaceState({}, document.title, '/reset-password')
      } catch (err) {
        if (!mounted) return
        setStatus('invalid')
        setError(err instanceof ApiError ? err.message : 'This reset link is invalid or has expired.')
      }
    }

    void prepareReset()

    return () => {
      mounted = false
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!sessionReady) {
      setError('This reset link is invalid or has expired.')
      return
    }

    if (password.length < 8) {
      const message = 'Password must be at least 8 characters.'
      setError(message)
      showToast(message, 'error')
      return
    }

    if (password !== confirmPassword) {
      const message = 'Passwords do not match.'
      setError(message)
      showToast(message, 'error')
      return
    }

    setStatus('submitting')
    setError(null)

    try {
      const credentials = recoveryCredentialsRef.current
      const { user } = await api.resetPassword({
        password,
        ...(credentials
          ? {
              code: credentials.code,
              token_hash: credentials.token_hash,
              accessToken: credentials.accessToken,
              refreshToken: credentials.refreshToken,
            }
          : {}),
      })
      setSessionUser(user)
      showToast('Password updated. Welcome back!', 'success')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setStatus('ready')
      const message = err instanceof ApiError ? err.message : 'Password reset failed. Please try again.'
      setError(message)
      showToast(message, 'error')
    }
  }

  if (status === 'loading') {
    return (
      <AuthLayout>
        <div className="space-y-5 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200" />
          <div className="space-y-1">
            <h1 className={authHeadingClass}>Preparing password reset</h1>
            <p className={authSubheadingClass}>Checking your reset link...</p>
          </div>
        </div>
      </AuthLayout>
    )
  }

  if (status === 'invalid') {
    return (
      <AuthLayout>
        <div className="space-y-5 text-center">
          <div className="space-y-1">
            <h1 className={authHeadingClass}>Reset link expired</h1>
            <p className={authSubheadingClass}>{error}</p>
          </div>
          <div className={authActionStackClass}>
            <Link to="/forgot-password" className={authPrimaryButtonClass}>
              Request a new link
            </Link>
            <Link to="/login" className={authSecondaryButtonClass}>
              Back to sign in
            </Link>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <h1 className={authHeadingClass}>Choose a new password</h1>
          <p className={authSubheadingClass}>Enter and confirm your new password below.</p>
        </div>

        {error ? (
          <p className={authErrorClass} role="alert">
            {error}
          </p>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="password" className={authLabelClass}>
            New password<span className={authRequiredClass}>*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              disabled={status === 'submitting'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`${authInputClass} pr-10`}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[var(--db-muted)] transition-colors duration-200 hover:text-[var(--db-text)]"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className={authLabelClass}>
            Confirm password<span className={authRequiredClass}>*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              disabled={status === 'submitting'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={`${authInputClass} pr-10`}
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[var(--db-muted)] transition-colors duration-200 hover:text-[var(--db-text)]"
            >
              <EyeIcon open={showConfirmPassword} />
            </button>
          </div>
        </div>

        <button type="submit" disabled={status === 'submitting' || !isFormReady} className={authPrimaryButtonClass}>
          {status === 'submitting' ? 'Updating password...' : 'Update password'}
        </button>

        <p className="text-center text-sm text-[var(--db-muted)]">
          <Link to="/login" className={authLinkClass}>
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
