import type { ComponentType, SVGProps } from 'react'
import {
  IconCopywriter,
  IconDashboard,
  IconFunnel,
  IconPublications,
  IconStorytelling,
  IconStrategy,
} from './icons'

export type DashboardTabId =
  | 'dashboard'
  | 'strategy'
  | 'storytelling'
  | 'funnel'
  | 'copywriter'
  | 'publications'

export type DashboardTab = {
  id: DashboardTabId
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  description: string
}

export const TAB_AVATARS: Record<DashboardTabId, { src: string; alt: string }> = {
  dashboard: { src: '/alfred-avatar.png', alt: 'Alfred assistant' },
  strategy: { src: '/avatar-strategy.png', alt: 'Strategy expert' },
  storytelling: { src: '/avatar-storytelling.png', alt: 'Storytelling expert' },
  funnel: { src: '/avatar-funnel.png', alt: 'Funnel architect' },
  copywriter: { src: '/avatar-copywriter.png', alt: 'Copywriter' },
  publications: { src: '/avatar-publications.png', alt: 'Publications expert' },
}

export const DASHBOARD_TABS: DashboardTab[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: IconDashboard,
    description: 'Overview and quick actions',
  },
  {
    id: 'strategy',
    label: 'Strategy Expert',
    icon: IconStrategy,
    description: 'Plan and refine your strategy',
  },
  {
    id: 'storytelling',
    label: 'Storytelling',
    icon: IconStorytelling,
    description: 'Craft compelling narratives',
  },
  {
    id: 'funnel',
    label: 'Funnel Architect',
    icon: IconFunnel,
    description: 'Design conversion funnels',
  },
  {
    id: 'copywriter',
    label: 'Copywriter',
    icon: IconCopywriter,
    description: 'Write persuasive copy',
  },
  {
    id: 'publications',
    label: 'Publications',
    icon: IconPublications,
    description: 'Schedule and manage content',
  },
]

export type AiModel = {
  id: string
  name: string
  description: string
  badge?: string
}

export const AI_MODELS: AiModel[] = [
  {
    id: 'corebrain-alpha',
    name: 'CoreBrain Alpha',
    description: 'Balanced reasoning for everyday tasks',
    badge: 'Default',
  },
  {
    id: 'corebrain-pro',
    name: 'CoreBrain Pro',
    description: 'Deeper analysis for complex work',
  },
  {
    id: 'corebrain-fast',
    name: 'CoreBrain Fast',
    description: 'Quick responses for rapid iteration',
  },
]
