
'use client';

import type { Editor } from '@tiptap/react';
import type { Command, CommandContext, Book, Chapter } from './types';
import * as LucideIcons from 'lucide-react';
import Fuse from "fuse.js";
import { openCommandPalette } from '@/lib/palette-state';


type IconName = keyof typeof LucideIcons;

// This Map is the single source of truth for all commands in the application.
const COMMANDS = new Map<string, Command>();

export function registerCommand(command: Command) {
  if (COMMANDS.has(command.id)) {
    // This is useful for hot-reloading in development.
    // console.warn(`Command with id ${command.id} is already registered. Overwriting.`);
  }
  COMMANDS.set(command.id, command);
}

export function getCommand(id: string): Command | undefined {
  return COMMANDS.get(id);
}

export function getAllCommands(): Command[] {
  return Array.from(COMMANDS.values());
}

export function getCommandsByTab(tab: Command['tab']): Command[] {
  return getAllCommands().filter(cmd => cmd.tab === tab);
}

export function getCommandIcon(iconName?: string): React.ElementType {
  if (iconName && iconName in LucideIcons) {
    return LucideIcons[iconName as IconName];
  }
  return LucideIcons.HelpCircle; // Default fallback icon
}


// --- HOME TAB COMMANDS ---
registerCommand({
  id: 'core.undo',
  title: 'Undo',
  icon: 'Undo',
  shortcut: 'Ctrl+Z',
  tab: 'home',
  group: 'history',
  run: ({ editor }) => editor?.chain().focus().undo().run(),
  canRun: ({ editor }) => editor?.can().undo() ?? false,
});

registerCommand({
  id: 'core.redo',
  title: 'Redo',
  icon: 'Redo',
  shortcut: 'Ctrl+Y',
  tab: 'home',
  group: 'history',
  run: ({ editor }) => editor?.chain().focus().redo().run(),
  canRun: ({ editor }) => editor?.can().redo() ?? false,
});

registerCommand({
  id: 'format.font.decrease',
  title: 'Decrease Font Size',
  icon: 'Minus',
  tab: 'home',
  group: 'font',
  run: ({ editor }) => {
    // This is a placeholder for a more complex font size logic
    for (let i = 2; i <= 6; i++) {
        if (editor?.isActive('heading', { level: i })) {
            editor?.chain().focus().toggleHeading({ level: (i+1) as any }).run();
            return;
        }
    }
    if (editor?.isActive('paragraph')) {
        editor?.chain().focus().toggleHeading({ level: 6 }).run();
    }
  },
});

registerCommand({
  id: 'format.font.increase',
  title: 'Increase Font Size',
  icon: 'Plus',
  tab: 'home',
  group: 'font',
  run: ({ editor }) => {
    for (let i = 6; i >= 1; i--) {
        if (editor?.isActive('heading', { level: i })) {
            editor?.chain().focus().toggleHeading({ level: (i-1) as any }).run();
            return;
        }
    }
    editor?.chain().focus().setParagraph().run();
  },
});

registerCommand({
  id: 'format.bold',
  title: 'Bold',
  icon: 'Bold',
  shortcut: 'Ctrl+B',
  tab: 'home',
  group: 'style',
  run: ({ editor }) => editor?.chain().focus().toggleBold().run(),
  isActive: ({ editor }) => editor?.isActive('bold') ?? false,
});

registerCommand({
  id: 'format.italic',
  title: 'Italic',
  icon: 'Italic',
  shortcut: 'Ctrl+I',
  tab: 'home',
  group: 'style',
  run: ({ editor }) => editor?.chain().focus().toggleItalic().run(),
  isActive: ({ editor }) => editor?.isActive('italic') ?? false,
});

registerCommand({
  id: 'format.underline',
  title: 'Underline',
  icon: 'Underline',
  shortcut: 'Ctrl+U',
  tab: 'home',
  group: 'style',
  run: ({ editor }) => editor?.chain().focus().toggleUnderline().run(),
  isActive: ({ editor }) => editor?.isActive('underline') ?? false,
});

registerCommand({
  id: 'format.align.left',
  title: 'Align Left',
  icon: 'AlignLeft',
  shortcut: 'Ctrl+Shift+L',
  tab: 'home',
  group: 'align',
  run: ({ editor }) => editor?.chain().focus().setTextAlign('left').run(),
  isActive: ({ editor }) => editor?.isActive({ textAlign: 'left' }) ?? false,
});

registerCommand({
  id: 'format.align.center',
  title: 'Align Center',
  icon: 'AlignCenter',
  shortcut: 'Ctrl+Shift+E',
  tab: 'home',
  group: 'align',
  run: ({ editor }) => editor?.chain().focus().setTextAlign('center').run(),
  isActive: ({ editor }) => editor?.isActive({ textAlign: 'center' }) ?? false,
});

registerCommand({
  id: 'format.align.right',
  title: 'Align Right',
  icon: 'AlignRight',
  shortcut: 'Ctrl+Shift+R',
  tab: 'home',
  group: 'align',
  run: ({ editor }) => editor?.chain().focus().setTextAlign('right').run(),
  isActive: ({ editor }) => editor?.isActive({ textAlign: 'right' }) ?? false,
});

// --- INSERT TAB COMMANDS ---
registerCommand({
  id: 'insert.image',
  title: 'Image',
  icon: 'Image',
  tab: 'insert',
  group: 'media',
  run: () => alert('Feature: Insert Image'),
});
registerCommand({
  id: 'insert.table',
  title: 'Table',
  icon: 'Table',
  tab: 'insert',
  group: 'structure',
  run: () => alert('Feature: Insert Table'),
});
registerCommand({
  id: 'insert.divider',
  title: 'Divider',
  icon: 'Minus',
  tab: 'insert',
  group: 'structure',
  run: ({ editor }) => editor?.chain().focus().setHorizontalRule().run(),
});
registerCommand({
  id: 'insert.chapter_break',
  title: 'Chapter Break',
  icon: 'BookCopy',
  tab: 'insert',
  group: 'structure',
  run: () => alert('Feature: Insert Chapter Break'),
});
registerCommand({
  id: 'insert.comment',
  title: 'Comment',
  icon: 'MessageSquarePlus',
  tab: 'insert',
  group: 'inline',
  run: () => alert('Feature: Insert Comment'),
});
registerCommand({
  id: 'insert.link',
  title: 'Link',
  icon: 'Link',
  tab: 'insert',
  group: 'inline',
  run: () => alert('Feature: Insert Link'),
});
registerCommand({
  id: 'insert.quote',
  title: 'Quote',
  icon: 'Quote',
  tab: 'insert',
  group: 'blocks',
  run: ({ editor }) => editor?.chain().focus().toggleBlockquote().run(),
});
registerCommand({
  id: 'insert.codeblock',
  title: 'Code Block',
  icon: 'Code',
  tab: 'insert',
  group: 'blocks',
  run: ({ editor }) => editor?.chain().focus().toggleCodeBlock().run(),
});


// --- LAYOUT TAB COMMANDS ---
registerCommand({
  id: 'layout.page_size',
  title: 'Page Size',
  icon: 'RectangleHorizontal',
  tab: 'layout',
  group: 'page',
  run: () => alert('Feature: Page Size'),
});
registerCommand({
  id: 'layout.margins',
  title: 'Margins',
  icon: 'RectangleVertical',
  tab: 'layout',
  group: 'page',
  run: () => alert('Feature: Margins'),
});
registerCommand({
  id: 'layout.focus_mode',
  title: 'Focus Mode',
  icon: 'Crosshair',
  tab: 'layout',
  group: 'view',
  run: () => alert('Feature: Focus Mode'),
});


// --- REVIEW TAB COMMANDS ---
registerCommand({
  id: 'review.word_count',
  title: 'Word Count',
  icon: 'Scan',
  tab: 'review',
  group: 'stats',
  run: () => alert('Feature: Word Count'),
});
registerCommand({
  id: 'review.comments_panel',
  title: 'Comments',
  icon: 'MessagesSquare',
  tab: 'review',
  group: 'feedback',
  run: () => alert('Feature: Comments Panel'),
});

// --- AI TAB COMMANDS ---
registerCommand({
  id: 'ai.rewrite',
  title: 'Rewrite Selection',
  icon: 'Wand2',
  tab: 'ai',
  description: 'Select text and ask the AI to rewrite it.',
  run: () => alert('AI: Rewrite action triggered'),
});
registerCommand({
  id: 'ai.summarize',
  title: 'Summarize',
  icon: 'BrainCircuit',
  tab: 'ai',
  description: 'The AI will generate a summary of the current chapter.',
  run: () => alert('AI: Summarize action triggered'),
});
registerCommand({
  id: 'ai.continue_writing',
  title: 'Continue Writing',
  icon: 'PenLine',
  tab: 'ai',
  description: 'Let the AI continue writing from your cursor.',
  run: () => alert('AI: Continue Writing'),
});
registerCommand({
  id: 'ai.fix_grammar',
  title: 'Fix Grammar',
  icon: 'SpellCheck2',
  tab: 'ai',
  description: 'Correct grammar and spelling in the selection.',
  run: () => alert('AI: Fix Grammar'),
});


// --- VIEW TAB COMMANDS ---
registerCommand({
  id: 'view.fullscreen',
  title: 'Toggle Fullscreen',
  icon: 'Fullscreen',
  tab: 'view',
  run: () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
  },
});
registerCommand({
  id: 'view.zen_mode',
  title: 'Zen Mode',
  icon: 'Bird',
  tab: 'view',
  run: () => alert('Toggling Zen Mode'),
});
registerCommand({
  id: 'view.toggle_sidebar',
  title: 'Toggle Sidebar',
  icon: 'PanelLeft',
  tab: 'view',
  run: ({ toggleSidebar }) => toggleSidebar(),
});


// --- GLOBAL COMMANDS (for Command Palette) ---
registerCommand({
  id: 'cmd.open_palette',
  title: 'Open Command Palette',
  keywords: ['command', 'palette', 'search', 'action'],
  shortcut: 'Ctrl+Shift+P',
  run: openCommandPalette,
});

// FUZZY SEARCH LOGIC
let fuse: Fuse<Command>;

const initializeFuse = () => {
  fuse = new Fuse(getAllCommands(), {
    keys: ["title", "keywords", "tab"],
    threshold: 0.3,
    includeScore: true,
  });
};

// We need to re-initialize if features are registered dynamically (e.g., by plugins).
const originalRegister = registerCommand;
const reinitializingRegisterCommand = (command: Command) => {
    originalRegister(command);
    initializeFuse(); // Re-index on every new command registration.
}
// Replace the global registerCommand with our enhanced version.
Object.assign(registerCommand, reinitializingRegisterCommand);
initializeFuse(); // Initial indexing


export function searchCommands(query: string, context: CommandContext): Command[] {
  if (!fuse) initializeFuse();
  
  const allCommands = getAllCommands();

  const availableCommands = allCommands.filter(c => c.canRun ? c.canRun(context) : true);

  if (!query.trim()) {
      return availableCommands.slice(0, 20);
  }

  return fuse.search(query)
    .map(result => result.item)
    .filter(c => c.canRun ? c.canRun(context) : true);
}
