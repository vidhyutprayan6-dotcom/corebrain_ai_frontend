import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

type ProtectedRouteProps = {
  children: React.ReactNode
}

function RouteSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1115] text-[#fafafa]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-500" />
    </div>
  )
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <RouteSpinner />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!user.emailConfirmed) {
    return <Navigate to="/signup/check-email" replace state={{ email: user.email }} />
  }

  return children
}

type GuestRouteProps = {
  children: React.ReactNode
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <RouteSpinner />
  }

  if (user?.emailConfirmed) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
