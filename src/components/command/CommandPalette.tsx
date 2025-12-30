
'use client';

import { useState, useEffect } from 'react';
import { searchFeatures } from '@/engine/search/useFeatureSearch';
import type { Feature } from '@/engine/features/FeatureRegistry';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function CommandPalette({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFeatures, setFilteredFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    if (open) {
      setSearchTerm('');
    }
  }, [open]);

  useEffect(() => {
    setFilteredFeatures(searchFeatures(searchTerm));
  }, [searchTerm]);

  const handleAction = (action: () => void) => {
    action();
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start pt-32 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div 
        className="bg-card w-[640px] rounded-xl shadow-2xl border border-border"
        onClick={e => e.stopPropagation()}
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
            filteredFeatures.map(f => (
              <Button
                key={f.id}
                onClick={() => handleAction(f.action)}
                variant="ghost"
                className="w-full justify-start text-left px-3 py-2 h-auto"
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
