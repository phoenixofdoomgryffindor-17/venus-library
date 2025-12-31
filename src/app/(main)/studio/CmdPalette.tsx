
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { searchCommands, type Command } from '@/lib/commands';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { CommandContext } from '@/lib/types';
import paletteState, { openCommandPalette } from '@/lib/palette-state';

interface CmdPaletteProps {
    context: CommandContext;
}

export default function CmdPalette({ context }: CmdPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Subscribe to the global palette state
    const unsubscribe = paletteState.subscribe(setIsOpen);
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Use `e.key` for modern browsers, and check for `P` not `p`
      if (e.key === 'P' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        openCommandPalette();
      }
      if (e.key === 'Escape' && paletteState.isOpen) {
        openCommandPalette();
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
    // Search commands based on the current context (editor, etc.)
    setFilteredCommands(searchCommands(searchTerm, context));
    setActiveIndex(0);
  }, [searchTerm, context, isOpen]);

  const handleAction = useCallback((command: Command) => {
    command.run(context);
    openCommandPalette(); // Close palette after running command
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
      onClick={openCommandPalette}
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
