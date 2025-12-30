
import type { Feature } from './Feature';

// Use a Map for efficient additions and deletions by ID.
const features = new Map<string, Feature>();

export function registerFeature(feature: Feature) {
  if (features.has(feature.id)) {
    console.warn(`Feature with id ${feature.id} is already registered. Overwriting.`);
  }
  features.set(feature.id, feature);
}

export function unregisterFeature(id: string) {
    features.delete(id);
}

export function getFeaturesByTab(tab: Feature['tab']) {
  return Array.from(features.values()).filter(f => f.tab === tab);
}

export function getAllFeatures() {
  return Array.from(features.values());
}

// Pre-register some core features
registerFeature({
  id: "bold",
  title: "Bold",
  keywords: ["bold", "strong", "font weight"],
  tab: "home",
  shortcut: "Ctrl+B",
  action: () => document.execCommand("bold"),
});
registerFeature({
  id: "italic",
  title: "Italic",
  keywords: ["italic", "emphasis"],
  tab: "home",
  shortcut: "Ctrl+I",
  action: () => document.execCommand("italic"),
});
registerFeature({
  id: "heading-style",
  title: "Heading Style",
  keywords: ["style", "heading", "format", "h1", "h2"],
  tab: "layout",
  action: () => console.log("Apply heading"),
});
registerFeature({
  id: "ai.rewrite",
  title: "AI: Rewrite Selection",
  keywords: ["rewrite", "ai", "paraphrase"],
  tab: "ai",
  shortcut: "Ctrl+Shift+R",
  action: () => console.log("running ai rewrite")
});
