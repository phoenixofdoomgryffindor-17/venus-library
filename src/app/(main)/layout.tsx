
'use client';
import { Suspense } from 'react';
import { Header } from '@/components/header';
import MainApp from '@/components/main-app';
import PageTransition from '@/components/page-transtion';
import { Loader2 } from 'lucide-react';
import CmdPalette from './studio/CmdPalette';
import { useEditor } from '@tiptap/react';
import { useMemo } from 'react';
import type { CommandContext } from '@/lib/types';


export default function MainLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  // A dummy context for the global command palette.
  // In a real app, this might be populated by a global state manager (e.g., Zustand, Redux)
  const dummyEditor = useEditor({ editable: false });
  const dummyContext = useMemo((): CommandContext => ({
    editor: dummyEditor,
    book: { id: '', authorId: '', title: '', slug: '', description: '', genre: '', coverUrl: '', status: 'draft', price: 0, createdAt: '', updatedAt: '' },
    activeChapter: { id: '', bookId: '', title: '', content: '', order: 0, wordCount: 0 },
  }), [dummyEditor]);

  return (
    <MainApp>
      <Header />
      <CmdPalette context={dummyContext} />
      <main className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          }
        >
          <PageTransition>{children}</PageTransition>
        </Suspense>
      </main>
    </MainApp>
  );
}
