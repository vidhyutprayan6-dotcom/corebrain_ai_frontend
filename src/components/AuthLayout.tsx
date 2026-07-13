import type { ReactNode } from 'react'
import { BrainAvatar } from './dashboard/BrainAvatar'
import { Logo } from './Logo'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-root dashboard-root dark min-h-screen bg-[var(--db-bg)] text-[var(--db-text)]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-8">
          <div className="flex w-full max-w-[390px] flex-col items-center">
            <div className="mb-8 flex w-full flex-col items-center text-center lg:hidden">
              <div className="auth-reveal auth-reveal-1">
                <BrainAvatar size={96} />
              </div>
              <h2 className="auth-reveal auth-reveal-2 mt-4 text-2xl font-bold tracking-tight text-[var(--db-text)] sm:text-3xl">
                CoreBrain.ai
              </h2>
              <p className="auth-reveal auth-reveal-3 mt-2 text-base text-[var(--db-muted)] sm:text-lg">
                Your Own AI Department
              </p>
            </div>

            <div className="auth-reveal auth-reveal-4 w-full rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)] p-6 shadow-sm sm:p-8">
              {children}
            </div>
          </div>
        </section>

        <aside className="relative hidden overflow-hidden lg:block">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgb(176, 122, 0) 0%, rgb(224, 176, 0) 50%, rgb(176, 122, 0) 100%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.55) 100%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle, rgba(255,220,120,0.25) 0%, rgba(255,220,120,0) 60%)',
            }}
          />

          <div className="relative flex h-full flex-col items-center justify-center px-10 text-center">
            <div className="auth-reveal auth-reveal-1">
              <Logo size={256} />
            </div>
            <h2 className="auth-reveal auth-reveal-2 mt-4 text-4xl font-bold tracking-tight text-zinc-950">
              CoreBrain.ai
            </h2>
            <p className="auth-reveal auth-reveal-3 mt-2 text-xl text-zinc-900">Your Own AI Department</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
