
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { searchCommands, type Command } from '@/lib/commands';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { CommandContext } from '@/lib/types';

// Simple event emitter for global state management
type PaletteStateListener = (isOpen: boolean) => void;
const paletteState = {
  isOpen: false,
  listeners: new Set<PaletteStateListener>(),
  toggle() {
    this.isOpen = !this.isOpen;
    this.listeners.forEach(cb => cb(this.isOpen));
  },
  subscribe(callback: PaletteStateListener) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
};
export const openCommandPalette = () => paletteState.toggle();

interface CmdPaletteProps {
    context: CommandContext;
}

export default function CmdPalette({ context }: CmdPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return paletteState.subscribe(setIsOpen);
  }, []);
  
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      if ((isMac ? e.metaKey : e.ctrlKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        paletteState.toggle();
      }
      if (e.key === 'Escape' && paletteState.isOpen) {
        paletteState.toggle();
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
    setFilteredCommands(searchCommands(searchTerm, context));
    setActiveIndex(0);
  }, [searchTerm, context]);

  const handleAction = useCallback((command: Command) => {
    command.run(context);
    paletteState.toggle();
  }, [context]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const command = filteredCommands[activeIndex];
      if (command) {
        handleAction(command);
      }
    }
  }, [filteredCommands, activeIndex, handleAction]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start pt-32 backdrop-blur-sm"
      onClick={() => paletteState.toggle()}
    >
      <div 
        className="bg-card w-[640px] rounded-xl shadow-2xl border border-border"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Search className="text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Type a command or search..."
            className="w-full text-base h-12 bg-transparent border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="p-2 max-h-96 overflow-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No results found.</div>
          ) : (
            filteredCommands.map((c, index) => (
              <Button
                key={c.id}
                onClick={() => handleAction(c)}
                variant={activeIndex === index ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left px-3 py-2 h-auto"
                aria-selected={activeIndex === index}
              >
                {c.title}
                {c.shortcut && (
                  <kbd className="ml-auto text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded-md">
                    {c.shortcut}
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
