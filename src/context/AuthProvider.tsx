import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, type AuthUser } from '../lib/api'
import { readCachedUser, writeCachedUser } from '../lib/auth-cache'

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  setSessionUser: (user: AuthUser | null) => void
  refreshSession: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const cachedUser = readCachedUser()
  const [user, setUser] = useState<AuthUser | null>(cachedUser)
  const [loading, setLoading] = useState(!cachedUser)

  const setSessionUser = useCallback((nextUser: AuthUser | null) => {
    setUser(nextUser)
    writeCachedUser(nextUser)
    setLoading(false)
  }, [])

  const refreshSession = useCallback(async () => {
    try {
      const { user: nextUser } = await api.getSession()
      setUser(nextUser)
      writeCachedUser(nextUser)
    } catch {
      setUser(null)
      writeCachedUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshSession()
  }, [refreshSession])

  const signOut = useCallback(async () => {
    setUser(null)
    writeCachedUser(null)
    try {
      await api.signOut()
    } catch {
      // Local session is already cleared; cookie cleanup can retry on next visit.
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      setSessionUser,
      refreshSession,
      signOut,
    }),
    [user, loading, setSessionUser, refreshSession, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
