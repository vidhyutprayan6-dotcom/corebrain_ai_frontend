import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthCallbackRedirect } from './components/AuthCallbackRedirect'
import { ToastContainer } from './components/ToastContainer'
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthProvider'
import { ThemeProvider } from './context/ThemeProvider'
import { ToastProvider } from './context/ToastProvider'

const AppPage = lazy(() => import('./pages/AppPage').then((module) => ({ default: module.AppPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })))
const SignUpPage = lazy(() => import('./pages/SignUpPage').then((module) => ({ default: module.SignUpPage })))
const SignUpCheckEmailPage = lazy(() =>
  import('./pages/SignUpCheckEmailPage').then((module) => ({ default: module.SignUpCheckEmailPage })),
)
const SignUpVerifyPage = lazy(() =>
  import('./pages/SignUpVerifyPage').then((module) => ({ default: module.SignUpVerifyPage })),
)
const ForgotPasswordPage = lazy(() =>
  import('./pages/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })),
)
const ResetPasswordPage = lazy(() =>
  import('./pages/ResetPasswordPage').then((module) => ({ default: module.ResetPasswordPage })),
)

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1115] text-[#fafafa]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-500" />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<AuthCallbackRedirect />} />
                <Route
                  path="/login"
                  element={
                    <GuestRoute>
                      <LoginPage />
                    </GuestRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <GuestRoute>
                      <SignUpPage />
                    </GuestRoute>
                  }
                />
                <Route path="/register" element={<Navigate to="/signup" replace />} />
                <Route
                  path="/forgot-password"
                  element={
                    <GuestRoute>
                      <ForgotPasswordPage />
                    </GuestRoute>
                  }
                />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/signup/check-email" element={<SignUpCheckEmailPage />} />
                <Route path="/signup/verify" element={<SignUpVerifyPage />} />
                <Route path="/auth/verify" element={<SignUpVerifyPage />} />
                <Route path="/auth/callback" element={<SignUpVerifyPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AppPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
            <ToastContainer />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
