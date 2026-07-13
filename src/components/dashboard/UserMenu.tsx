import { useEffect, useId, useRef, type MouseEvent as ReactMouseEvent } from 'react'
import { IconLogOut } from './icons'
import { RippleButton } from './RippleButton'

type UserMenuProps = {
  userName?: string | null
  userEmail?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSignOut: () => void
  compact?: boolean
}

export function UserMenu({
  userName,
  userEmail,
  open,
  onOpenChange,
  onSignOut,
  compact = false,
}: UserMenuProps) {
  const menuId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const displayName = userName?.trim() || null
  const avatarInitial = (userName?.trim() || userEmail || 'A').charAt(0).toUpperCase()

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onOpenChange(false)
    }

    const timeoutId = window.setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 0)

    document.addEventListener('keydown', handleEscape)
    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onOpenChange])

  function handleToggle(event: ReactMouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    onOpenChange(!open)
  }

  const avatar = (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f] text-sm font-semibold text-white">
      {avatarInitial}
    </span>
  )

  return (
    <div ref={containerRef} className="relative">
      <RippleButton
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label="Account menu"
        onClick={handleToggle}
        className={
          compact
            ? 'mx-auto flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 hover:bg-[var(--db-hover)]'
            : 'flex w-full items-center gap-3 rounded-[5px] px-6 py-2 text-left transition-colors duration-200 hover:bg-[var(--db-hover)]'
        }
      >
        {avatar}
        {!compact && displayName ? (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-[var(--db-text)]">{displayName}</span>
          </span>
        ) : null}
      </RippleButton>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className={`absolute z-[100] rounded-[5px] border border-[var(--db-border)] bg-[var(--db-dropdown)] py-1 shadow-lg ${
            compact
              ? 'bottom-[calc(100%+0.35rem)] left-1/2 w-40 -translate-x-1/2'
              : 'bottom-[calc(100%+0.35rem)] left-2 right-2'
          }`}
          style={{ boxShadow: `0 10px 30px var(--db-shadow)` }}
          onClick={(event) => event.stopPropagation()}
        >
          {!compact && userEmail ? (
            <p className="truncate px-3 py-1.5 text-xs text-[var(--db-muted)]">{userEmail}</p>
          ) : null}
          <RippleButton
            type="button"
            role="menuitem"
            onClick={() => {
              onOpenChange(false)
              void onSignOut()
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--db-text)] transition-colors duration-200 hover:bg-[var(--db-hover)]"
          >
            <IconLogOut className="h-[18px] w-[18px] text-[var(--db-muted)]" />
            Sign out
          </RippleButton>
        </div>
      ) : null}
    </div>
  )
}
