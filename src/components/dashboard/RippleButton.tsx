import { useRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react'

type RippleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export function RippleButton({ children, className = '', onClick, ...props }: RippleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const button = buttonRef.current
    if (button) {
      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2.2
      const ripple = document.createElement('span')
      ripple.className = 'ripple-spread'
      ripple.style.width = `${size}px`
      ripple.style.height = `${size}px`
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`
      button.appendChild(ripple)
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true })
    }
    onClick?.(event)
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`ripple-host relative overflow-hidden ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}
