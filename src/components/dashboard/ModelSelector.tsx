import { useEffect, useId, useRef, type MouseEvent as ReactMouseEvent } from 'react'
import { AI_MODELS, type AiModel } from './dashboard-data'
import { IconCheck, IconChevronDown } from './icons'
import { RippleButton } from './RippleButton'

type ModelSelectorProps = {
  selectedModel: AiModel
  onSelect: (model: AiModel) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  placement?: 'above' | 'below'
}

export function ModelSelector({
  selectedModel,
  onSelect,
  open,
  onOpenChange,
  placement = 'above',
}: ModelSelectorProps) {
  const menuId = useId()
  const containerRef = useRef<HTMLDivElement>(null)

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

  const menuPosition =
    placement === 'above'
      ? 'bottom-[calc(100%+0.35rem)] right-0'
      : 'top-[calc(100%+0.35rem)] left-0'

  return (
    <div ref={containerRef} className="relative">
      <RippleButton
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={menuId}
        onClick={handleToggle}
        className="flex items-center gap-1.5 rounded-[5px] border border-[var(--db-border)] bg-[var(--db-surface-muted)] px-3 py-1.5 text-xs font-medium text-[var(--db-text)] shadow-sm transition-colors duration-200 hover:bg-[var(--db-hover)] sm:text-sm"
      >
        <span className="max-w-[8.5rem] truncate sm:max-w-none">{selectedModel.name}</span>
        <IconChevronDown
          className={`h-[18px] w-[18px] shrink-0 text-[var(--db-muted)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </RippleButton>

      {open ? (
        <div
          id={menuId}
          role="listbox"
          aria-label="Select AI model"
          className={`absolute ${menuPosition} z-50 w-[min(18rem,calc(100vw-3rem))] rounded-[5px] border border-[var(--db-border)] bg-[var(--db-dropdown)] py-1 shadow-lg`}
          style={{ boxShadow: `0 10px 30px var(--db-shadow)` }}
          onClick={(event) => event.stopPropagation()}
        >
          <ul className="max-h-64 overflow-y-auto">
            {AI_MODELS.map((model) => {
              const isSelected = model.id === selectedModel.id
              return (
                <li key={model.id}>
                  <RippleButton
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelect(model)
                      onOpenChange(false)
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left transition-colors duration-200 hover:bg-[var(--db-hover)] ${
                      isSelected ? 'bg-[var(--db-active-bg)]' : ''
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium text-[var(--db-text)]">{model.name}</span>
                      <p className="mt-0.5 text-xs leading-snug text-[var(--db-muted)]">{model.description}</p>
                    </div>
                    {isSelected ? <IconCheck className="h-4 w-4 shrink-0 text-[var(--db-active-icon)]" /> : null}
                  </RippleButton>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
