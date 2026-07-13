import { useTheme } from '../../context/ThemeProvider'
import { IconMoon, IconSun } from './icons'
import { RippleButton } from './RippleButton'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <RippleButton
      type="button"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--db-muted)] transition-colors duration-200 hover:bg-[var(--db-hover)] hover:text-[var(--db-text)]"
    >
      {theme === 'dark' ? <IconSun className="h-[23px] w-[23px]" /> : <IconMoon className="h-[23px] w-[23px]" />}
    </RippleButton>
  )
}
