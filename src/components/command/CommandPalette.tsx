
'use client';

import { useState, useEffect } from 'react';
import { searchFeatures } from '@/engine/search/useFeatureSearch';
import type { Feature } from '@/engine/features/FeatureRegistry';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerFeature } from '@/engine/features/FeatureRegistry';

// This state should be managed globally, e.g., via Zustand or Jotai
// For simplicity here, we'll use a simple event emitter.
const paletteState = {
  isOpen: false,
  listeners: new Set<(isOpen: boolean) => void>(),
  toggle() {
    this.isOpen = !this.isOpen;
    this.listeners.forEach(cb => cb(this.isOpen));
  },
  subscribe(cb: (isOpen: boolean) => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
};

// Global action to open the palette
export const openCommandPalette = () => paletteState.toggle();

// Register a command to open the command palette itself
registerFeature({
  id: 'core.openCommands',
  title: 'Open Command Palette',
  keywords: ['command', 'palette', 'search', 'action'],
  shortcut: 'Ctrl+K',
  action: openCommandPalette,
  tab: 'view'
});


export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFeatures, setFilteredFeatures] = useState<Feature[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return paletteState.subscribe(setIsOpen);
  }, []);
  
  useEffect(() => {
    // This allows Ctrl+K to work globally by listening on the window
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        paletteState.toggle();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setFilteredFeatures(searchFeatures(searchTerm));
    setActiveIndex(0);
  }, [searchTerm]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredFeatures.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredFeatures.length) % filteredFeatures.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const feature = filteredFeatures[activeIndex];
      if (feature) {
        handleAction(feature.action);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start pt-32 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-card w-[640px] rounded-xl shadow-2xl border border-border"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="p-4 border-b border-border">
          <Input
            autoFocus
            placeholder="Type a command or search..."
            className="w-full text-base h-12 bg-transparent border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="p-2 max-h-96 overflow-auto">
          {filteredFeatures.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No results found.</div>
          ) : (
            filteredFeatures.map((f, index) => (
              <Button
                key={f.id}
                onClick={() => handleAction(f.action)}
                variant={activeIndex === index ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left px-3 py-2 h-auto"
                aria-selected={activeIndex === index}
              >
                {f.title}
                {f.shortcut && (
                  <kbd className="ml-auto text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded-md">
                    {f.shortcut}
                  </kbd>
                )}
              </Button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
