
import type { Editor } from '@tiptap/react';

export type Feature = {
  id: string;
  title: string;
  keywords?: string[];
  icon?: string;
  shortcut?: string;
  tab: 'home' | 'insert' | 'layout' | 'review' | 'ai' | 'view';
  action: (editor?: Editor | null) => void;
};

// Use a Map for efficient additions and deletions by ID.
const features = new Map<string, Feature>();

export function registerFeature(feature: Feature) {
  if (features.has(feature.id)) {
    // In a real app, you might want to be stricter, but for hot-reloading this is fine.
    // console.warn(`Feature with id ${feature.id} is already registered. Overwriting.`);
  }
  features.set(feature.id, feature);
}

export function unregisterFeature(id: string) {
    features.delete(id);
}

export function getFeaturesByTab(tab: Feature['tab']): Feature[] {
  return Array.from(features.values()).filter(f => f.tab === tab);
}

export function getAllFeatures(): Feature[] {
  return Array.from(features.values());
}

// --- Pre-register some core features ---
// This central registry is the single source of truth for all commands.
// The Command Palette and the Toolbar both read from here.

// -- HOME TAB --
registerFeature({
  id: 'bold',
  title: 'Bold',
  keywords: ['strong', 'font weight'],
  icon: 'Bold',
  shortcut: 'Ctrl+B',
  tab: 'home',
  action: (editor) => editor?.chain().focus().toggleBold().run(),
});

registerFeature({
  id: 'italic',
  title: 'Italic',
  keywords: ['emphasis'],
  icon: 'Italic',
  shortcut: 'Ctrl+I',
  tab: 'home',
  action: (editor) => editor?.chain().focus().toggleItalic().run(),
});

registerFeature({
  id: 'underline',
  title: 'Underline',
  icon: 'UnderlineIcon',
  shortcut: 'Ctrl+U',
  tab: 'home',
  action: (editor) => editor?.chain().focus().toggleUnderline().run(),
});

registerFeature({
  id: 'strike',
  title: 'Strikethrough',
  icon: 'Strikethrough',
  shortcut: 'Ctrl+Shift+X',
  tab: 'home',
  action: (editor) => editor?.chain().focus().toggleStrike().run(),
});

// -- AI TAB --
registerFeature({
  id: 'ai.rewrite',
  title: 'Rewrite Selection',
  keywords: ['rewrite', 'ai', 'paraphrase'],
  tab: 'ai',
  action: () => console.log('AI Rewrite action triggered'),
});

registerFeature({
  id: 'ai.summarize',
  title: 'Summarize',
  keywords: ['summary', 'ai', 'tldr'],
  tab: 'ai',
  action: () => console.log('AI Summarize action triggered'),
});
