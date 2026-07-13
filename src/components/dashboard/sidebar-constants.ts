export const SIDEBAR_STORAGE_KEY = 'corebrain-sidebar-width'

export const SIDEBAR_MINI_WIDTH = 64
export const SIDEBAR_BRAND_LOGO_SIZE = 40
export const SIDEBAR_MINI_LOGO_SIZE = 30
export const SIDEBAR_NAV_TOP_OFFSET_PX = 16
/** Narrowest expanded sidebar (matches minimum comfortable layout). */
export const SIDEBAR_MIN_WIDTH = 200
export const SIDEBAR_DEFAULT_WIDTH = 240
/** Previous max (384px) + 150px */
export const SIDEBAR_MAX_WIDTH = 534

export function clampSidebarWidth(width: number) {
  return Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, width))
}

export function readStoredSidebarWidth() {
  if (typeof window === 'undefined') return SIDEBAR_DEFAULT_WIDTH

  const raw = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
  if (!raw) return SIDEBAR_DEFAULT_WIDTH

  const parsed = Number(raw)
  if (!Number.isFinite(parsed)) return SIDEBAR_DEFAULT_WIDTH

  return clampSidebarWidth(parsed)
}

export function storeSidebarWidth(width: number) {
  window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(clampSidebarWidth(width)))
}
