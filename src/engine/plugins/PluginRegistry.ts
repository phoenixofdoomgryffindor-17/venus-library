
import type { VenusPlugin } from './VenusPlugin'
import { grantPermissions, revokePermissions } from './PermissionGate'
import { registerFeature, unregisterFeature } from '@/engine/features/FeatureRegistry'
import { registerShortcut, unregisterShortcut } from '@/engine/shortcuts/ShortcutRegistry'

const loaded = new Map<string, VenusPlugin>()

export function loadPlugin(plugin: VenusPlugin) {
  if (loaded.has(plugin.id)) {
    console.warn(`Plugin ${plugin.id} is already loaded.`);
    return;
  }

  // In a real app, you would show a user prompt here to confirm granting these permissions.
  // For now, we will grant them automatically.
  console.log(`Granting permissions for ${plugin.id}:`, plugin.permissions);
  grantPermissions(plugin.permissions)

  plugin.features?.forEach(registerFeature)
  plugin.shortcuts?.forEach(s =>
    registerShortcut(s.combo, s.action)
  )

  plugin.onLoad?.()
  loaded.set(plugin.id, plugin)
  console.log(`Plugin ${plugin.id} loaded.`);
}

export function unloadPlugin(id: string) {
  const plugin = loaded.get(id)
  if (!plugin) return

  // Unregister all associated features and shortcuts
  plugin.features?.forEach(f => unregisterFeature(f.id));
  plugin.shortcuts?.forEach(s => unregisterShortcut(s.combo));

  // Revoke permissions
  revokePermissions(plugin.permissions);

  plugin.onUnload?.()
  loaded.delete(id)
  console.log(`Plugin ${id} unloaded.`);
}

export function getLoadedPlugins() {
  return Array.from(loaded.values())
}

export function isPluginLoaded(id: string): boolean {
  return loaded.has(id);
}
