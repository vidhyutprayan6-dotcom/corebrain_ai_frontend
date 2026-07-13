import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  authErrorClass,
  authHeadingClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
  authPrimaryButtonClass,
  authRequiredClass,
  authSubheadingClass,
} from '../components/auth/auth-classes'
import { AuthLayout } from '../components/AuthLayout'
import { EyeIcon } from '../components/EyeIcon'
import { useAuth } from '../context/AuthProvider'
import { useToast } from '../context/ToastProvider'
import { ApiError, api } from '../lib/api'

export function SignUpPage() {
  const navigate = useNavigate()
  const { setSessionUser } = useAuth()
  const { showToast } = useToast()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isFormReady =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = fullName.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName || !trimmedEmail || !password) {
      const message = 'Please fill in all required fields.'
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

    if (password.length < 8) {
      const message = 'Password must be at least 8 characters.'
      setError(message)
      showToast(message, 'error')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const result = await api.signUp({ fullName: trimmedName, email: trimmedEmail, password })

      if (!result.needsEmailVerification && result.user.emailConfirmed) {
        setSessionUser(result.user)
        navigate('/dashboard')
        showToast('Account created successfully.', 'success')
        return
      }

      navigate('/signup/check-email', { state: { email: trimmedEmail } })
      showToast('Sign-up started. Check your email to verify your account.', 'success')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Sign-up failed. Please try again.'
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
          <h1 className={authHeadingClass}>Sign up</h1>
          <p className={authSubheadingClass}>
            Sign-up includes email verification. Submit the form and we&apos;ll send a link to finish.
          </p>
        </div>

        {error ? (
          <p className={authErrorClass} role="alert">
            {error}
          </p>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="name" className={authLabelClass}>
            Full name<span className={authRequiredClass}>*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            disabled={submitting}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className={authInputClass}
          />
        </div>

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
          <label htmlFor="password" className={authLabelClass}>
            Password<span className={authRequiredClass}>*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete="new-password"
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
              minLength={8}
              autoComplete="new-password"
              disabled={submitting}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={`${authInputClass} pr-10`}
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[var(--db-muted)] transition-colors duration-200 hover:text-[var(--db-text)]"
            >
              <EyeIcon open={showConfirmPassword} />
            </button>
          </div>
        </div>

        <button type="submit" disabled={submitting || !isFormReady} className={authPrimaryButtonClass}>
          {submitting ? 'Starting sign-up...' : 'Sign up'}
        </button>

        <p className="text-center text-sm text-[var(--db-muted)]">
          Already have an account?{' '}
          <Link to="/login" className={authLinkClass}>
            Sign in
          </Link>
        </p>

        <p className="text-center text-sm text-[var(--db-muted)]">
          Forgot your password?{' '}
          <Link to="/forgot-password" className={authLinkClass}>
            Reset it
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
