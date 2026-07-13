import { useToast } from '../context/ToastProvider'
import { useMediaQuery } from './dashboard/useMediaQuery'

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()
  const isPhone = useMediaQuery('(max-width: 525px)')

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      className={
        isPhone
          ? 'pointer-events-none fixed inset-x-0 bottom-4 z-[200] flex flex-col items-center gap-2 px-4'
          : 'pointer-events-none fixed top-4 right-4 z-[200] flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0'
      }
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.type === 'error' ? 'alert' : 'status'}
          className={`toast-item pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${
            isPhone ? 'toast-item--phone' : 'toast-item--desktop'
          } ${toast.exiting ? 'toast-item--exit' : 'toast-item--enter'} ${
            toast.type === 'success'
              ? 'toast-success'
              : toast.type === 'error'
                ? 'toast-error'
                : 'toast-info'
          } ${isPhone ? 'w-full max-w-md' : 'w-full'}`}
        >
          <p className="min-w-0 flex-1 text-sm leading-snug">{toast.message}</p>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 rounded p-0.5 text-current opacity-70 transition-opacity hover:opacity-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
