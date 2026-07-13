import { useEffect, useRef } from 'react'
import { BrainAvatar } from './BrainAvatar'
import { DASHBOARD_TABS, type DashboardTabId } from './dashboard-data'
import { IconClose, IconMenu } from './icons'
import { RippleButton } from './RippleButton'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'

const SITE_TITLE = 'CoreBrain.ai'
const ICON_SIZE = 'h-[23px] w-[23px]'

type DashboardMobileHeaderProps = {
  activeTab: DashboardTabId
  onTabChange: (tab: DashboardTabId) => void
  navOpen: boolean
  onNavOpenChange: (open: boolean) => void
  onSignOut: () => void
  userName?: string | null
  userEmail?: string | null
  userMenuOpen: boolean
  onUserMenuOpenChange: (open: boolean) => void
}

export function DashboardMobileHeader({
  activeTab,
  onTabChange,
  navOpen,
  onNavOpenChange,
  onSignOut,
  userName,
  userEmail,
  userMenuOpen,
  onUserMenuOpenChange,
}: DashboardMobileHeaderProps) {
  const navRef = useRef<HTMLDivElement>(null)
  const activeTabMeta = DASHBOARD_TABS.find((tab) => tab.id === activeTab) ?? DASHBOARD_TABS[0]

  useEffect(() => {
    if (!navOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        onNavOpenChange(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onNavOpenChange(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [navOpen, onNavOpenChange])

  function handleTabSelect(tabId: DashboardTabId) {
    onTabChange(tabId)
    onNavOpenChange(false)
    onUserMenuOpenChange(false)
  }

  return (
    <header className="relative z-30 shrink-0 border-b border-[var(--db-border)] bg-[var(--db-sidebar)]">
      <div className="flex h-[var(--db-header-h)] items-center gap-2 px-3 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <BrainAvatar size={26} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[var(--db-text)]">{SITE_TITLE}</p>
            <p className="truncate text-xs text-[var(--db-muted)]">{activeTabMeta.label}</p>
          </div>
        </div>

        <ThemeToggle />

        <RippleButton
          type="button"
          aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={navOpen}
          onClick={() => onNavOpenChange(!navOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--db-muted)] transition-colors duration-200 hover:bg-[var(--db-hover)] hover:text-[var(--db-text)]"
        >
          {navOpen ? <IconClose className={ICON_SIZE} /> : <IconMenu className={ICON_SIZE} />}
        </RippleButton>
      </div>

      <div
        ref={navRef}
        className={`overflow-hidden border-t border-[var(--db-border)] bg-[var(--db-sidebar)] transition-[max-height,opacity] duration-200 ease-in-out ${
          navOpen ? 'max-h-[min(32rem,75dvh)] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <nav className="overflow-y-auto pb-2" aria-label="Dashboard navigation">
          <ul>
            {DASHBOARD_TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = tab.id === activeTab
              return (
                <li key={tab.id}>
                  <RippleButton
                    type="button"
                    onClick={() => handleTabSelect(tab.id)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-[var(--db-active-bg)] text-[var(--db-active-text)]'
                        : 'text-[var(--db-muted)] hover:bg-[var(--db-hover)] hover:text-[var(--db-text)]'
                    }`}
                  >
                    <Icon
                      className={`${ICON_SIZE} shrink-0 transition-transform duration-200 ${
                        isActive ? 'scale-[1.3] text-[var(--db-active-icon)]' : 'text-[var(--db-muted)]'
                      }`}
                    />
                    <span className="truncate">{tab.label}</span>
                  </RippleButton>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-[var(--db-border)] px-2 py-2">
          <UserMenu
            userName={userName}
            userEmail={userEmail}
            open={userMenuOpen}
            onOpenChange={onUserMenuOpenChange}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </header>
  )
}
