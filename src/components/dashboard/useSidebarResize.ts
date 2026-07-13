import { useCallback, useEffect, useRef, useState } from 'react'
import { clampSidebarWidth, storeSidebarWidth } from './sidebar-constants'

type UseSidebarResizeOptions = {
  enabled: boolean
  width: number
  onWidthChange: (width: number) => void
}

export function useSidebarResize({ enabled, width, onWidthChange }: UseSidebarResizeOptions) {
  const [isResizing, setIsResizing] = useState(false)
  const [previewWidth, setPreviewWidth] = useState<number | null>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const previewWidthRef = useRef(width)

  const startResize = useCallback(
    (event: React.MouseEvent) => {
      if (!enabled) return
      event.preventDefault()
      previewWidthRef.current = width
      setPreviewWidth(width)
      setIsResizing(true)
    },
    [enabled, width],
  )

  useEffect(() => {
    if (!isResizing) return

    function handleMouseMove(event: MouseEvent) {
      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0
      const nextWidth = clampSidebarWidth(event.clientX - sidebarLeft)
      previewWidthRef.current = nextWidth
      setPreviewWidth(nextWidth)
    }

    function handleMouseUp() {
      const clamped = clampSidebarWidth(previewWidthRef.current)
      onWidthChange(clamped)
      storeSidebarWidth(clamped)
      setIsResizing(false)
      setPreviewWidth(null)
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, onWidthChange])

  const displayWidth = previewWidth !== null ? previewWidth : width

  return {
    sidebarRef,
    isResizing,
    displayWidth: enabled ? clampSidebarWidth(displayWidth) : width,
    startResize,
  }
}
