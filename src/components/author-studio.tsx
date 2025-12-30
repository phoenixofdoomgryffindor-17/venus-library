
"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Book, Chapter } from '@/lib/types';
import type { Block } from '@/engine/pagination/PageModel';
import { Button } from '@/components/ui/button';
import { Loader2, Check, ArrowLeft, Undo, Redo } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { useFirestore } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import EditorToolbar from './editor-toolbar';
import { Logo } from './icons';
import { EditorCanvas } from './editor/EditorCanvas';
import { rewriteChapterContent } from '@/ai/flows/rewrite-chapter-content';

interface AuthorStudioProps {
  book: Book;
  initialChapters: Chapter[];
}

const createSlug = (title: string) => {
  if (!title) {
    return '';
  }
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const GlobalNav = ({ book, onExit }: { book: Book, onExit: () => void }) => {
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(book.title);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleTitleBlur = async () => {
    setIsTitleEditing(false);
    if (editableTitle === book.title) return;
    
    setSaveStatus('saving');
    try {
        const bookRef = doc(firestore, 'books', book.id);
        await updateDoc(bookRef, {
            title: editableTitle,
            slug: createSlug(editableTitle),
            updatedAt: serverTimestamp(),
        });
        setSaveStatus('saved');
        toast({ title: "Book title updated!" });
    } catch (e: any) {
        setSaveStatus('unsaved');
        toast({ title: "Error Saving Title", description: e.message, variant: 'destructive' });
    }
  };

  return (
    <header className="flex h-[48px] flex-shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onExit} className="h-8 w-8">
                <ArrowLeft/>
            </Button>
            <Logo className="h-6 w-6 text-primary" />
            <span className="text-sm text-muted-foreground">Venus / Writing Studio</span>
        </div>
        <div className="flex-1 flex justify-center items-center gap-4">
              {isTitleEditing ? (
                <Input
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
                    className="h-8 max-w-sm text-center font-semibold bg-background border-primary"
                    autoFocus
                />
              ) : (
                <div
                    onClick={() => setIsTitleEditing(true)}
                    className="cursor-pointer rounded-md px-3 py-1 font-semibold hover:bg-accent/20"
                >
                    {editableTitle}
                </div>
              )}
              {/* This is the invisible slug component */}
              <div className="invisible">
                <label htmlFor="slug" className="text-xs text-muted-foreground">URL Slug</label>
                <Input id="slug" readOnly value={createSlug(editableTitle)} className="h-7 w-48 text-xs bg-muted border-dashed"/>
              </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
                {saveStatus === 'saving' && <><Loader2 className="h-4 w-4 animate-spin"/> Saving...</>}
                {saveStatus === 'saved' && <><Check className="h-4 w-4 text-green-500"/> Saved</>}
                {saveStatus === 'unsaved' && <div className="h-2 w-2 rounded-full bg-primary" title="Unsaved changes"/>}
            </div>
             <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled><Undo/></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled><Redo/></Button>
            </div>
            <Button variant="ghost" onClick={onExit}>
                Exit Studio
            </Button>
        </div>
    </header>
  )
}


export default function AuthorStudio({ book, initialChapters }: AuthorStudioProps) {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(initialChapters[0] ?? null);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // AI Feature States
  const [aiIsLoading, setAiIsLoading] = useState<string | null>(null);

  const { toast } = useToast();

  const blocks: Block[] = useMemo(() => {
    const content = activeChapter?.content || 'Welcome to your new book. Start writing here.';
    const paragraphs = content.split(/<\/?p>/).filter(p => p.trim() !== '');
    if (paragraphs.length === 0 && content) {
        return [{
            id: crypto.randomUUID(),
            type: 'paragraph',
            content: content,
        }];
    }
    return paragraphs.map(p => ({
        id: crypto.randomUUID(),
        type: 'paragraph',
        content: p.replace(/<[^>]+>/g, ''),
    }));
  }, [activeChapter]);

  const hasUnsavedChanges = useMemo(() => {
    // This logic needs to be adapted for the new block-based structure.
    return false; 
  }, []);
  
  const handleSaveContent = useCallback(async () => {
    // Save logic will be more complex with block editor
  }, []);

  const handleExit = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      router.push('/write');
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
        
        <GlobalNav book={book} onExit={handleExit} />

        <EditorToolbar editor={null} aiTools={{}} />

        <main className="flex-1 overflow-auto bg-[#f1f3f7] dark:bg-[#181a1f]">
          <EditorCanvas blocks={blocks} />
        </main>
        
        <footer className="flex h-[32px] flex-shrink-0 items-center justify-between border-t border-border bg-card px-4 text-xs text-muted-foreground">
            <div>
                <span>Page 1 of {chapters.length}</span>
            </div>
            <div className="flex gap-4">
                <span>{/* Word Count */} words</span>
                <span>{/* Character Count */} characters</span>
            </div>
            <div className="flex items-center gap-2">
                <span>AI Ready</span>
            </div>
        </footer>

        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
                    <AlertDialogDescription>
                        Do you want to save your work before leaving?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant="ghost" onClick={() => {
                        setShowExitDialog(false);
                        router.push('/write');
                    }}>
                        Discard Changes
                    </Button>
                     <Button onClick={async () => {
                        await handleSaveContent();
                        setShowExitDialog(false);
                        router.push('/write');
                    }}>
                        Save and Exit
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
