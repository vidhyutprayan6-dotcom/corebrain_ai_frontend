import { useAuth } from '../context/AuthProvider'

function pickDisplayName(value: string | null | undefined) {
  const trimmed = value?.trim()
  return trimmed || null
}

export function useResolvedDisplayName() {
  const { user } = useAuth()
  return pickDisplayName(user?.fullName)
}
