import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { useToast } from '../context/ToastProvider'
import { subscribeToVerificationComplete } from '../lib/auth-sync'

const POLL_INTERVAL_MS = 2000

export function useAwaitEmailVerification() {
  const navigate = useNavigate()
  const { user, refreshSession } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    if (!user?.emailConfirmed) {
      return
    }

    showToast('Email verified! Welcome to CoreBrain.ai', 'success')
    navigate('/dashboard', { replace: true })
  }, [navigate, showToast, user])

  useEffect(() => {
    let active = true

    async function syncSession() {
      if (!active) return
      await refreshSession()
    }

    void syncSession()

    const intervalId = window.setInterval(() => {
      void syncSession()
    }, POLL_INTERVAL_MS)

    const unsubscribe = subscribeToVerificationComplete(() => {
      void syncSession()
    })

    return () => {
      active = false
      window.clearInterval(intervalId)
      unsubscribe()
    }
  }, [refreshSession])
}
