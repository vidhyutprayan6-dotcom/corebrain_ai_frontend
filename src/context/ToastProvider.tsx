import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useMediaQuery } from '../components/dashboard/useMediaQuery'

export type ToastType = 'success' | 'error' | 'info'

export type Toast = {
  id: string
  message: string
  type: ToastType
  exiting: boolean
}

type ToastContextValue = {
  toasts: Toast[]
  showToast: (message: string, type?: ToastType) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_DURATION_MS: Record<ToastType, { desktop: number; phone: number }> = {
  success: { desktop: 4000, phone: 3000 },
  error: { desktop: 5500, phone: 3500 },
  info: { desktop: 4000, phone: 3000 },
}

const TOAST_EXIT_MS = 280

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Map<string, number>>(new Map())
  const exitTimersRef = useRef<Map<string, number>>(new Map())
  const isPhone = useMediaQuery('(max-width: 525px)')

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const exitTimer = exitTimersRef.current.get(id)
    if (exitTimer) {
      window.clearTimeout(exitTimer)
      exitTimersRef.current.delete(id)
    }
  }, [])

  const dismissToast = useCallback(
    (id: string) => {
      const timer = timersRef.current.get(id)
      if (timer) {
        window.clearTimeout(timer)
        timersRef.current.delete(id)
      }

      setToasts((current) => {
        const target = current.find((toast) => toast.id === id)
        if (!target || target.exiting) return current
        return current.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast))
      })

      const exitTimer = window.setTimeout(() => {
        removeToast(id)
      }, TOAST_EXIT_MS)

      exitTimersRef.current.set(id, exitTimer)
    },
    [removeToast],
  )

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current, { id, message, type, exiting: false }])

      const timer = window.setTimeout(() => {
        dismissToast(id)
      }, TOAST_DURATION_MS[type][isPhone ? 'phone' : 'desktop'])

      timersRef.current.set(id, timer)
    },
    [dismissToast, isPhone],
  )

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast,
    }),
    [dismissToast, showToast, toasts],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
