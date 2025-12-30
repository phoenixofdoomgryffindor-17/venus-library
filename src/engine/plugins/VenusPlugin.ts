
import type { Feature } from '@/engine/features/Feature'
import type { PluginPermission } from './PluginPermissions'

export interface VenusPlugin {
  id: string
  name: string
  version: string
  author: string
  description?: string

  permissions: PluginPermission[]

  features?: Feature[]
  shortcuts?: { combo: string; action: () => void }[]

  aiPrompts?: {
    id: string
    title: string
    handler: (context: any) => Promise<string>
  }[]

  onLoad?: () => void
  onUnload?: () => void
}
