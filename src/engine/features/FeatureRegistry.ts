
import type { Editor } from '@tiptap/react';
import { openCommandPalette } from '@/components/command/palette-state';

export type Feature = {
  id: string;
  title: string;
  keywords?: string[];
  description?: string;
  icon?: string;
  shortcut?: string;
  group?: string;
  canBeDisabled?: boolean;
  tab: 'home' | 'insert' | 'layout' | 'review' | 'ai' | 'plugins' | 'view';
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

// --- HOME TAB FEATURES ---
registerFeature({
  id: 'bold', title: 'Bold', icon: 'Bold', shortcut: 'Ctrl+B', tab: 'home', group: 'format',
  action: (editor) => editor?.chain().focus().toggleBold().run(),
});
registerFeature({
  id: 'italic', title: 'Italic', icon: 'Italic', shortcut: 'Ctrl+I', tab: 'home', group: 'format',
  action: (editor) => editor?.chain().focus().toggleItalic().run(),
});
registerFeature({
  id: 'underline', title: 'Underline', icon: 'UnderlineIcon', shortcut: 'Ctrl+U', tab: 'home', group: 'format',
  action: (editor) => editor?.chain().focus().toggleUnderline().run(),
});
registerFeature({
  id: 'strike', title: 'Strikethrough', icon: 'Strikethrough', shortcut: 'Ctrl+Shift+X', tab: 'home', group: 'format',
  action: (editor) => editor?.chain().focus().toggleStrike().run(),
});
registerFeature({
  id: 'alignLeft', title: 'Align Left', icon: 'AlignLeft', shortcut: 'Ctrl+Shift+L', tab: 'home', group: 'align',
  action: (editor) => editor?.chain().focus().setTextAlign('left').run(),
});
registerFeature({
  id: 'alignCenter', title: 'Align Center', icon: 'AlignCenter', shortcut: 'Ctrl+Shift+E', tab: 'home', group: 'align',
  action: (editor) => editor?.chain().focus().setTextAlign('center').run(),
});
registerFeature({
  id: 'alignRight', title: 'Align Right', icon: 'AlignRight', shortcut: 'Ctrl+Shift+R', tab: 'home', group: 'align',
  action: (editor) => editor?.chain().focus().setTextAlign('right').run(),
});
registerFeature({
  id: 'alignJustify', title: 'Justify', icon: 'AlignJustify', shortcut: 'Ctrl+Shift+J', tab: 'home', group: 'align',
  action: (editor) => editor?.chain().focus().setTextAlign('justify').run(),
});

// --- INSERT TAB FEATURES ---
registerFeature({
  id: 'insert.image', title: 'Image', icon: 'ImageIcon', tab: 'insert',
  action: () => alert('Feature: Insert Image'),
});
registerFeature({
  id: 'insert.table', title: 'Table', icon: 'Table', tab: 'insert',
  action: () => alert('Feature: Insert Table'),
});
registerFeature({
  id: 'insert.divider', title: 'Divider', icon: 'Minus', tab: 'insert',
  action: (editor) => editor?.chain().focus().setHorizontalRule().run(),
});
registerFeature({
  id: 'insert.footnote', title: 'Footnote', icon: 'Footnote', tab: 'insert',
  action: () => alert('Feature: Insert Footnote'),
});
registerFeature({
  id: 'insert.comment', title: 'Comment', icon: 'MessageSquare', tab: 'insert',
  action: () => alert('Feature: Insert Comment'),
});
registerFeature({
  id: 'insert.link', title: 'Link', icon: 'LinkIcon', tab: 'insert',
  action: (editor) => {
    const url = window.prompt('URL');
    if (url) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  },
});
registerFeature({
  id: 'insert.quote', title: 'Quote', icon: 'Quote', tab: 'insert',
  action: (editor) => editor?.chain().focus().toggleBlockquote().run(),
});
registerFeature({
  id: 'insert.codeblock', title: 'Code Block', icon: 'Code', tab: 'insert',
  action: (editor) => editor?.chain().focus().toggleCodeBlock().run(),
});

// --- LAYOUT TAB FEATURES ---
registerFeature({
  id: 'layout.margins', title: 'Margins', icon: 'PanelLeft', tab: 'layout',
  action: () => alert('Feature: Adjust Margins'),
});
registerFeature({
  id: 'layout.spacing', title: 'Line Spacing', icon: 'Rows', tab: 'layout',
  action: () => alert('Feature: Adjust Line Spacing'),
});

// --- REVIEW TAB FEATURES ---
registerFeature({
  id: 'review.spellcheck', title: 'Spell Check', icon: 'SpellCheck', tab: 'review',
  action: () => alert('Feature: Run Spell Check'),
});
registerFeature({
  id: 'review.trackchanges', title: 'Track Changes', icon: 'FileCheck', tab: 'review',
  action: () => alert('Feature: Toggle Track Changes'),
});
registerFeature({
  id: 'review.comments', title: 'Show Comments', icon: 'MessageCircle', tab: 'review',
  action: () => alert('Feature: Show Comments Panel'),
});
registerFeature({
  id: 'review.stats', title: 'Readability Stats', icon: 'BarChart', tab: 'review',
  action: () => alert('Feature: Show Readability Stats'),
});

// --- AI TAB FEATURES ---
registerFeature({
  id: 'ai.rewrite', title: 'Rewrite Selection', icon: 'Wand2', tab: 'ai',
  description: 'Select text in the editor and ask the AI to rewrite it.',
  action: () => alert('AI: Rewrite action triggered'),
});
registerFeature({
  id: 'ai.summarize', title: 'Summarize', icon: 'BrainCircuit', tab: 'ai',
  description: 'The AI will generate a summary of the current chapter.',
  action: () => alert('AI: Summarize action triggered'),
});
registerFeature({
  id: 'ai.character', title: 'Generate Character', icon: 'User', tab: 'ai',
  description: 'Provide a prompt to generate a new character profile.',
  action: () => alert('AI: Generate Character action triggered'),
});

// --- VIEW TAB FEATURES ---
registerFeature({
  id: 'view.fullscreen', title: 'Fullscreen', icon: 'Fullscreen', tab: 'view',
  action: () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
  },
});
registerFeature({
  id: 'view.zen', title: 'Zen Mode', icon: 'PanelLeft', tab: 'view',
  action: () => alert('Feature: Toggle Zen Mode'),
});
registerFeature({
  id: 'view.split', title: 'Split View', icon: 'Columns', tab: 'view',
  action: () => alert('Feature: Toggle Split View'),
});

// --- CORE (non-tab) FEATURES for COMMAND PALETTE ---
registerFeature({
    id: 'core.openCommands',
    title: 'Open Command Palette',
    keywords: ['command', 'palette', 'search', 'action'],
    shortcut: 'Ctrl+K',
    action: openCommandPalette,
    tab: 'view' // Assign to a tab so it doesn't get lost
});
