type LogoProps = {
  size?: number
  className?: string
}

export function Logo({ size = 192, className = '' }: LogoProps) {
  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/brain-logo.png"
        alt="CoreBrain.ai"
        width={size}
        height={size}
        className="block h-full w-full object-cover"
        draggable={false}
      />
    </div>
  )
}
