import { BrainAvatar } from './BrainAvatar'
import { DASHBOARD_TABS, type DashboardTabId } from './dashboard-data'
import { IconChevronRight, IconClose, IconPanelLeft } from './icons'
import { RippleButton } from './RippleButton'
import { SIDEBAR_MINI_WIDTH, SIDEBAR_BRAND_LOGO_SIZE, SIDEBAR_MINI_LOGO_SIZE, SIDEBAR_NAV_TOP_OFFSET_PX } from './sidebar-constants'
import { useSidebarResize } from './useSidebarResize'
import { UserMenu } from './UserMenu'

type DashboardSidebarProps = {
  activeTab: DashboardTabId
  onTabChange: (tab: DashboardTabId) => void
  isDesktop: boolean
  collapsed: boolean
  overlayOpen: boolean
  sidebarWidth: number
  onSidebarWidthChange: (width: number) => void
  onExpand: () => void
  onCollapse: () => void
  onSignOut: () => void
  userName?: string | null
  userEmail?: string | null
  userMenuOpen: boolean
  onUserMenuOpenChange: (open: boolean) => void
}

const SITE_TITLE = 'CoreBrain.ai'
const ICON_SIZE = 'h-[23px] w-[23px]'
const BRAND_TITLE_CLASS = 'text-xl font-bold leading-tight tracking-tight'

export function DashboardSidebar({
  activeTab,
  onTabChange,
  isDesktop,
  collapsed,
  overlayOpen,
  sidebarWidth,
  onSidebarWidthChange,
  onExpand,
  onCollapse,
  onSignOut,
  userName,
  userEmail,
  userMenuOpen,
  onUserMenuOpenChange,
}: DashboardSidebarProps) {
  const isMini = isDesktop ? collapsed : true
  const showInlineFull = isDesktop && !collapsed

  const { sidebarRef, isResizing, displayWidth, startResize } = useSidebarResize({
    enabled: showInlineFull,
    width: sidebarWidth,
    onWidthChange: onSidebarWidthChange,
  })

  const inlineSidebarWidth = showInlineFull ? displayWidth : SIDEBAR_MINI_WIDTH

  function handleTabSelect(tabId: DashboardTabId) {
    onTabChange(tabId)
    if (!isDesktop) onCollapse()
  }

  function handleMiniTabClick(tabId: DashboardTabId) {
    onTabChange(tabId)
    onExpand()
  }

  const expandArrowButton = (
    <RippleButton
      type="button"
      aria-label="Expand sidebar"
      onClick={onExpand}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--db-border)] bg-[var(--db-surface)] text-[var(--db-muted)] shadow-sm transition-all duration-200 hover:bg-[var(--db-hover)] hover:text-[var(--db-text)]"
      style={{ borderRadius: '50%' }}
    >
      <IconChevronRight className="h-4 w-4" />
    </RippleButton>
  )

  const collapseButton = (
    <RippleButton
      type="button"
      aria-label="Collapse sidebar"
      onClick={onCollapse}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--db-border)] bg-[var(--db-surface)] text-[var(--db-muted)] shadow-sm transition-all duration-200 hover:bg-[var(--db-hover)] hover:text-[var(--db-text)]"
      style={{ borderRadius: '50%' }}
    >
      <IconPanelLeft className="h-4 w-4" />
    </RippleButton>
  )

  const sidebarHeader = (
    <div
      className={`flex shrink-0 items-center ${
        isMini ? 'h-[var(--db-header-h)] justify-center' : 'gap-3 py-4 pl-6 pr-3'
      }`}
    >
      {isMini ? (
        <BrainAvatar size={SIDEBAR_MINI_LOGO_SIZE} />
      ) : (
        <>
          <BrainAvatar size={SIDEBAR_BRAND_LOGO_SIZE} />
          <h1 className={`min-w-0 flex-1 truncate text-[var(--db-text)] ${BRAND_TITLE_CLASS}`}>{SITE_TITLE}</h1>
          {collapseButton}
        </>
      )}
    </div>
  )

  const sidebarNav = (
    <nav
      className={`flex-1 overflow-y-auto overflow-x-hidden pb-2 ${showInlineFull ? '' : isMini ? 'pt-2' : ''}`}
      style={showInlineFull ? { paddingTop: SIDEBAR_NAV_TOP_OFFSET_PX } : undefined}
      aria-label="Dashboard navigation"
    >
      <ul className={isMini ? 'flex flex-col items-center gap-1 pl-2' : ''}>
        {DASHBOARD_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === activeTab
          return (
            <li key={tab.id} className={isMini ? '' : 'w-full'}>
              <RippleButton
                type="button"
                aria-label={tab.label}
                title={tab.label}
                onClick={() => (isMini ? handleMiniTabClick(tab.id) : handleTabSelect(tab.id))}
                className={`flex items-center text-left text-sm font-medium transition-colors duration-200 ${
                  isMini
                    ? `h-10 w-10 justify-center rounded-[5px] ${
                        isActive
                          ? 'bg-[var(--db-active-bg)] text-[var(--db-active-icon)]'
                          : 'text-[var(--db-muted)] hover:bg-[var(--db-hover)] hover:text-[var(--db-text)]'
                      }`
                    : `w-full gap-3 py-2 pl-8 pr-6 ${
                        isActive
                          ? 'bg-[var(--db-active-bg)] text-[var(--db-active-text)]'
                          : 'text-[var(--db-muted)] hover:bg-[var(--db-hover)] hover:text-[var(--db-text)]'
                      }`
                }`}
              >
                <Icon
                  className={`${ICON_SIZE} shrink-0 transition-transform duration-200 ${
                    isActive ? 'scale-[1.4] text-[var(--db-active-icon)]' : isMini ? '' : 'text-[var(--db-muted)]'
                  }`}
                />
                <span
                  className={`truncate whitespace-nowrap transition-[opacity,max-width] duration-200 ease-in-out ${
                    isMini ? 'max-w-0 opacity-0' : 'max-w-[12rem] opacity-100'
                  }`}
                >
                  {tab.label}
                </span>
              </RippleButton>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  const sidebarFooter = (
    <div
      className={`relative z-30 shrink-0 overflow-visible px-1 py-2 ${
        isMini ? '' : 'border-t border-[var(--db-border)]'
      }`}
    >
      <UserMenu
        userName={userName}
        userEmail={userEmail}
        open={userMenuOpen}
        onOpenChange={onUserMenuOpenChange}
        onSignOut={onSignOut}
        compact={isMini}
      />
    </div>
  )

  const overlaySidebar = (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-200 ${!isDesktop ? '' : 'hidden'} ${
        overlayOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <button
        type="button"
        aria-label="Close sidebar backdrop"
        className="absolute inset-0 bg-[var(--db-overlay)] backdrop-blur-[1px]"
        onClick={onCollapse}
      />
      <aside
        className={`absolute inset-y-0 left-0 flex w-[min(16rem,85vw)] flex-col border-r border-[var(--db-border)] bg-[var(--db-sidebar)] shadow-xl transition-transform duration-200 ease-in-out ${
          overlayOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex shrink-0 items-center gap-3 py-4 pl-6 pr-4">
          <BrainAvatar size={SIDEBAR_BRAND_LOGO_SIZE} />
          <h1 className={`min-w-0 flex-1 truncate text-[var(--db-text)] ${BRAND_TITLE_CLASS}`}>{SITE_TITLE}</h1>
          <RippleButton
            type="button"
            aria-label="Close sidebar"
            onClick={onCollapse}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--db-border)] bg-[var(--db-surface)] text-[var(--db-muted)] transition-colors duration-200 hover:bg-[var(--db-hover)] hover:text-[var(--db-text)]"
            style={{ borderRadius: '50%' }}
          >
            <IconClose className="h-4 w-4" />
          </RippleButton>
        </div>
        <nav
          className="flex-1 overflow-y-auto pb-2"
          style={{ paddingTop: SIDEBAR_NAV_TOP_OFFSET_PX }}
          aria-label="Dashboard navigation"
        >
          <ul>
            {DASHBOARD_TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = tab.id === activeTab
              return (
                <li key={tab.id}>
                  <RippleButton
                    type="button"
                    onClick={() => handleTabSelect(tab.id)}
                    className={`flex w-full items-center gap-3 py-2 pl-8 pr-6 text-left text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-[var(--db-active-bg)] text-[var(--db-active-text)]'
                        : 'text-[var(--db-muted)] hover:bg-[var(--db-hover)] hover:text-[var(--db-text)]'
                    }`}
                  >
                    <Icon
                      className={`${ICON_SIZE} shrink-0 transition-transform duration-200 ${
                        isActive ? 'scale-[1.4] text-[var(--db-active-icon)]' : 'text-[var(--db-muted)]'
                      }`}
                    />
                    <span className="truncate">{tab.label}</span>
                  </RippleButton>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="relative z-30 shrink-0 overflow-visible border-t border-[var(--db-border)] px-2 py-2">
          <UserMenu
            userName={userName}
            userEmail={userEmail}
            open={userMenuOpen}
            onOpenChange={onUserMenuOpenChange}
            onSignOut={onSignOut}
          />
        </div>
      </aside>
    </div>
  )

  return (
    <>
      <div ref={sidebarRef} className="relative h-full shrink-0">
        <aside
          className={`flex h-full flex-col border-r border-[var(--db-border)] bg-[var(--db-sidebar)] ${
            isResizing ? '' : 'transition-[width] duration-200 ease-in-out'
          }`}
          style={{ width: inlineSidebarWidth }}
        >
          {sidebarHeader}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{sidebarNav}</div>
          {sidebarFooter}
        </aside>

        {showInlineFull ? (
          <button
            type="button"
            aria-label="Resize sidebar"
            onMouseDown={startResize}
            className="absolute inset-y-0 right-0 z-10 w-1 translate-x-1/2 cursor-col-resize bg-transparent transition-colors hover:bg-[var(--db-active-icon)]/30"
          />
        ) : null}

        {isMini ? (
          <div className="absolute top-[calc(var(--db-header-h)/2)] right-0 z-20 -translate-y-1/2 translate-x-1/2">
            {expandArrowButton}
          </div>
        ) : null}
      </div>
      {overlaySidebar}
    </>
  )
}
