type BrainAvatarProps = {
  size?: number
  className?: string
}

export function BrainAvatar({ size = 28, className = '' }: BrainAvatarProps) {
  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/brain-logo.png"
        alt="CoreBrain"
        width={size}
        height={size}
        className="block h-full w-full object-cover"
        draggable={false}
      />
    </div>
  )
}
