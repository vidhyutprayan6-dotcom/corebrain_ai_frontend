import { useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'
import { useToast } from '../../context/ToastProvider'
import { TAB_AVATARS, AI_MODELS, type DashboardTabId } from './dashboard-data'
import { ModelSelector } from './ModelSelector'
import { RippleButton } from './RippleButton'
import { ThemeToggle } from './ThemeToggle'
import { IconClose, IconMic, IconPlus } from './icons'

type ChatWindowProps = {
  activeTab: DashboardTabId
  showHeader?: boolean
  userName?: string
}

type AttachedFile = {
  id: string
  file: File
  previewUrl?: string
}

const ACCEPTED_FILE_TYPES =
  'image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.ppt,.pptx,.md,.json'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

function greetingFirstName(displayName: string) {
  const trimmed = displayName.trim()
  if (!trimmed) return 'there'
  return trimmed.split(/\s+/)[0]
}

export function ChatWindow({ activeTab, showHeader = true, userName = '' }: ChatWindowProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0])
  const [modelMenuOpen, setModelMenuOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<AttachedFile[]>([])

  const tabAvatar = TAB_AVATARS[activeTab]

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!message.trim() && attachments.length === 0) return
    setMessage('')
    attachments.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
    })
    setAttachments([])
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files?.length) return

    const accepted: AttachedFile[] = []
    const rejected: string[] = []

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        rejected.push(`${file.name} (${formatFileSize(file.size)})`)
        continue
      }

      accepted.push({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      })
    }

    if (rejected.length > 0) {
      showToast(
        rejected.length === 1
          ? `${rejected[0]} exceeds the 10MB limit.`
          : `${rejected.length} files exceed the 10MB limit.`,
        'error',
      )
    }

    if (accepted.length > 0) {
      setAttachments((current) => [...current, ...accepted])
    }

    event.target.value = ''
  }

  function removeAttachment(id: string) {
    setAttachments((current) => {
      const target = current.find((item) => item.id === id)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return current.filter((item) => item.id !== id)
    })
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-[var(--db-bg)] text-[var(--db-text)] transition-colors duration-200">
      {showHeader ? (
        <header className="flex h-[var(--db-header-h)] shrink-0 items-center justify-end px-4 sm:px-5">
          <ThemeToggle />
        </header>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-3 py-3 sm:px-6 sm:py-6">
        <div className="w-full max-w-3xl">
          <div className="flex flex-col items-center justify-center text-center">
            <img
              src={tabAvatar.src}
              alt={tabAvatar.alt}
              className="mb-5 h-24 w-24 rounded-2xl object-cover object-top shadow-sm sm:h-28 sm:w-28"
            />
            <h1 className="text-2xl font-semibold text-[var(--db-text)] sm:text-3xl">
              Hi, {greetingFirstName(userName)}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--db-muted)] sm:text-base">
              How can I help you today?
            </p>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-3 pb-3 pt-1 sm:px-6 sm:pb-5">
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl">
          <div className="rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)] p-2.5 shadow-sm transition-colors duration-200 sm:p-3">
            {attachments.length > 0 ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachments.map((item) => (
                  <div
                    key={item.id}
                    className="relative flex items-center gap-2 rounded-[5px] border border-[var(--db-border)] bg-[var(--db-surface-muted)] px-2 py-1.5"
                  >
                    {item.previewUrl ? (
                      <img
                        src={item.previewUrl}
                        alt={item.file.name}
                        className="h-10 w-10 rounded-[5px] object-cover"
                      />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-[var(--db-hover)] text-[10px] font-medium uppercase text-[var(--db-muted)]">
                        {item.file.name.split('.').pop()?.slice(0, 4) ?? 'file'}
                      </span>
                    )}
                    <span className="max-w-[8rem] truncate text-xs text-[var(--db-text)]">{item.file.name}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${item.file.name}`}
                      onClick={() => removeAttachment(item.id)}
                      className="rounded-[5px] p-0.5 text-[var(--db-muted)] transition-colors duration-200 hover:bg-[var(--db-hover)] hover:text-[var(--db-text)]"
                    >
                      <IconClose className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex items-start gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED_FILE_TYPES}
                className="hidden"
                onChange={handleFileSelect}
              />
              <RippleButton
                type="button"
                aria-label="Upload attachment"
                onClick={() => fileInputRef.current?.click()}
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] text-[var(--db-muted)] transition-colors duration-200 hover:bg-[var(--db-hover)] hover:text-[var(--db-text)]"
              >
                <IconPlus className="h-[21px] w-[21px]" />
              </RippleButton>

              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a message..."
                rows={1}
                className="min-h-[2.25rem] min-w-0 flex-1 resize-none bg-transparent py-1 text-sm leading-relaxed text-[var(--db-text)] outline-none placeholder:text-[var(--db-muted)] sm:text-base"
              />
            </div>

            <div className="mt-1.5 flex items-center justify-end gap-2">
              <ModelSelector
                selectedModel={selectedModel}
                onSelect={setSelectedModel}
                open={modelMenuOpen}
                onOpenChange={setModelMenuOpen}
                placement="above"
              />

              <RippleButton
                type="button"
                aria-label="Voice input"
                className="flex h-9 w-9 items-center justify-center rounded-[5px] text-[var(--db-muted)] transition-colors duration-200 hover:bg-[var(--db-hover)] hover:text-[var(--db-text)]"
              >
                <IconMic className="h-[21px] w-[21px]" />
              </RippleButton>
            </div>
          </div>

          <p className="mt-2 text-center text-[11px] text-[var(--db-muted)]">
            CoreBrain can make mistakes. Verify important information.
          </p>
        </form>
      </div>
    </section>
  )
}
