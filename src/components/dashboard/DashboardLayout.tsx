import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthProvider'
import { useTheme } from '../../context/ThemeProvider'
import { useToast } from '../../context/ToastProvider'
import type { DashboardTabId } from './dashboard-data'
import { ChatWindow } from './ChatWindow'
import { DashboardMobileHeader } from './DashboardMobileHeader'
import { DashboardSidebar } from './DashboardSidebar'
import { readStoredSidebarWidth } from './sidebar-constants'
import { useResolvedDisplayName } from '../../hooks/useResolvedDisplayName'
import { useMediaQuery } from './useMediaQuery'

export function DashboardLayout() {
  const { user, signOut } = useAuth()
  const displayName = useResolvedDisplayName()
  const { theme } = useTheme()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<DashboardTabId>('dashboard')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarOverlayOpen, setSidebarOverlayOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(readStoredSidebarWidth)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const isPhone = useMediaQuery('(max-width: 525px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    if (isPhone) {
      setSidebarOverlayOpen(false)
    } else if (isDesktop) {
      setMobileNavOpen(false)
      setSidebarOverlayOpen(false)
    } else {
      setSidebarCollapsed(false)
    }
  }, [isPhone, isDesktop])

  function handleExpandSidebar() {
    if (isDesktop) {
      setSidebarCollapsed(false)
      return
    }
    setSidebarOverlayOpen(true)
  }

  function handleCollapseSidebar() {
    if (isDesktop) {
      setSidebarCollapsed(true)
      return
    }
    setSidebarOverlayOpen(false)
  }

  async function handleSignOut() {
    void signOut()
    showToast('Signed out successfully.', 'success')
  }

  return (
    <div
      className={`dashboard-root flex h-[100dvh] overflow-hidden bg-[var(--db-bg)] text-[var(--db-text)] ${
        isPhone ? 'flex-col' : 'flex-row'
      } ${theme === 'dark' ? 'dark' : ''}`}
    >
      {isPhone ? (
        <DashboardMobileHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          navOpen={mobileNavOpen}
          onNavOpenChange={setMobileNavOpen}
          onSignOut={handleSignOut}
          userName={displayName}
          userEmail={user?.email}
          userMenuOpen={userMenuOpen}
          onUserMenuOpenChange={setUserMenuOpen}
        />
      ) : (
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isDesktop={isDesktop}
          collapsed={sidebarCollapsed}
          overlayOpen={sidebarOverlayOpen}
          sidebarWidth={sidebarWidth}
          onSidebarWidthChange={setSidebarWidth}
          onExpand={handleExpandSidebar}
          onCollapse={handleCollapseSidebar}
          onSignOut={handleSignOut}
          userName={displayName}
          userEmail={user?.email}
          userMenuOpen={userMenuOpen}
          onUserMenuOpenChange={setUserMenuOpen}
        />
      )}

      <main className="flex min-h-0 min-w-0 flex-1 flex-col transition-colors duration-200">
        <ChatWindow activeTab={activeTab} showHeader={!isPhone} userName={displayName ?? ''} />
      </main>
    </div>
  )
}
