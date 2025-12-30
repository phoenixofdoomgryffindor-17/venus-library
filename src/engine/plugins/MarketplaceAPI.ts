
import type { VenusPlugin } from './VenusPlugin';
import { ALL_PLUGINS } from '@/plugins/all';

// This is a stub for a real API call. In a production app, this would
// fetch manifest data from a secure backend to prevent tampering.
export async function fetchMarketplace(): Promise<VenusPlugin[]> {
  // We return the full plugin objects here now, as we aren't dynamically importing code.
  return Promise.resolve(ALL_PLUGINS);
}

// This function is no longer needed as we are not fetching code dynamically.
// Plugins are now all statically imported.
/*
export async function fetchPlugin(id: string): Promise<any> {
    const { TOP_PLUGINS } = await import('@/plugins/top');
    const plugin = TOP_PLUGINS.find(p => p.id === id);
    if (!plugin) {
        throw new Error(`Plugin with id ${id} not found in local repository.`);
    }
    return plugin;
}
*/
