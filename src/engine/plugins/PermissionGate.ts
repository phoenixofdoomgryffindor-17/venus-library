
import { PluginPermission } from './PluginPermissions'

const granted = new Set<PluginPermission>()

export function grantPermissions(perms: PluginPermission[]) {
  perms.forEach(p => granted.add(p))
}

export function requirePermission(p: PluginPermission) {
  if (!granted.has(p)) {
    // In a real app, you might show a user-facing dialog here.
    // For now, we throw an error to make it clear during development.
    throw new Error(`Plugin missing required permission: ${p}`)
  }
}

export function revokePermissions(perms: PluginPermission[]) {
    perms.forEach(p => granted.delete(p));
}
