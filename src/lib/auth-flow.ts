export function isPkceVerificationError(message: string) {
  const normalized = message.toLowerCase()
  return normalized.includes('code verifier') || normalized.includes('auth code')
}

export function isAlreadyVerifiedMessage(message: string) {
  const normalized = message.toLowerCase()
  return (
    normalized.includes('already verified') ||
    normalized.includes('email_verified_sign_in') ||
    normalized.includes('already been verified') ||
    normalized.includes('already confirmed')
  )
}

export function redirectToSignInAfterVerification(message = 'Your email is verified. Sign in with your password.') {
  try {
    sessionStorage.setItem('auth_flash', JSON.stringify({ type: 'success', message }))
  } catch {
    // Ignore storage errors.
  }
  window.location.replace('/login?email_verified=1')
}
