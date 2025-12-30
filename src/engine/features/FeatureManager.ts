
import { FeatureEngine } from './FeatureEngine';
import { FeatureRegistry } from './FeatureRegistry';

export class FeatureManager {
  private instances = new Map<string, FeatureEngine>();

  constructor(private registry: FeatureRegistry) {}

  load(featureKey: string) {
    if (this.instances.has(featureKey)) return;

    const ctor = this.registry.get(featureKey);
    if (!ctor) {
      throw new Error(`Unknown feature: ${featureKey}`);
    }

    const instance = new ctor();
    instance.init();
    this.instances.set(featureKey, instance);
  }

  unload(featureKey: string) {
    const instance = this.instances.get(featureKey);
    if (!instance) return;

    instance.dispose();
    this.instances.delete(featureKey);
  }

  loadMany(keys: string[]) {
    keys.forEach(k => this.load(k));
  }

  unloadAll() {
    this.instances.forEach(f => f.dispose());
    this.instances.clear();
  }
}
