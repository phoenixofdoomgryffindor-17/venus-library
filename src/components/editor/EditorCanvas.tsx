
'use client';

import { paginate, type Block } from '@/engine/pagination/PaginationEngine';

export function EditorCanvas({ blocks }: { blocks: Block[] }) {
  const pages = paginate(blocks);

  return (
    <div className="flex-1 overflow-auto bg-gray-100/10 p-8 flex justify-center">
      <div className="flex flex-col items-center gap-10">
        {pages.map((page, i) => (
          <div
            key={page.id}
            className="bg-card w-[820px] min-h-[1056px] shadow-2xl p-24 text-foreground/90 font-serif text-lg leading-relaxed"
          >
            {page.blocks.map(b => (
              <p key={b.id} className="mb-4">{b.content}</p>
            ))}
            <div className="text-xs text-muted-foreground text-center mt-16 absolute bottom-8 left-1/2 -translate-x-1/2">
              Page {i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
