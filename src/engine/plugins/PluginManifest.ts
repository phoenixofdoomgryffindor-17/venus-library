
import type { PluginPermission } from './PluginPermissions'

export type PluginManifest = {
  id: string
  name: string
  version: string
  author: string
  description: string
  permissions: PluginPermission[]
  price?: number
  verified?: boolean
}
