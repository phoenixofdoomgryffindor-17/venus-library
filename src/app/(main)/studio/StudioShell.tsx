
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Book, Chapter, CommandContext } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, Check, ArrowLeft, Undo, Redo, Search } from 'lucide-react';
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
import { Logo } from '@/components/icons';
import EditorSurface from './EditorSurface';
import Ribbon from './Ribbon';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { openCommandPalette } from '@/lib/palette-state';

interface StudioShellProps {
  book: Book;
  initialChapters: Chapter[];
}

const createSlug = (title: string) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const TopBar = ({ book, onExit, saveStatus, editor, onTitleChange }: { book: Book, onExit: () => void, saveStatus: 'saved' | 'saving' | 'unsaved', editor: any, onTitleChange: (newTitle: string) => void }) => {
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(book.title);
  
  const handleTitleBlur = () => {
    setIsTitleEditing(false);
    if (editableTitle.trim() && editableTitle !== book.title) {
        onTitleChange(editableTitle);
    } else {
        setEditableTitle(book.title); // Revert if empty or unchanged
    }
  };

  useEffect(() => {
    setEditableTitle(book.title);
  }, [book.title]);

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
                    {book.title}
                </div>
              )}
        </div>
        <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
                {saveStatus === 'saving' && <><Loader2 className="h-4 w-4 animate-spin"/> Saving...</>}
                {saveStatus === 'saved' && <><Check className="h-4 w-4 text-green-500"/> Saved</>}
                {saveStatus === 'unsaved' && <div className="h-2 w-2 rounded-full bg-primary" title="Unsaved changes"/>}
            </div>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={openCommandPalette}>
                    <Search />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()}><Undo/></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()}><Redo/></Button>
            </div>
            <Button variant="ghost" onClick={onExit}>
                Exit Studio
            </Button>
        </div>
    </header>
  )
}

export default function StudioShell({ book: initialBook, initialChapters }: StudioShellProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [book, setBook] = useState<Book>(initialBook);
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters.length > 0 ? initialChapters : [{ id: 'new', bookId: book.id, title: 'Chapter 1', content: '', order: 1, wordCount: 0 }]);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  
  const activeChapter = useMemo(() => chapters[activeChapterIndex], [chapters, activeChapterIndex]);

  const [showExitDialog, setShowExitDialog] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: true,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
    ],
    content: activeChapter?.content || '',
    onUpdate: ({ editor }) => {
      setSaveStatus('unsaved');
    },
    autofocus: 'end',
    editable: true,
  });

  const handleTitleChange = async (newTitle: string) => {
    if (!firestore) return;

    const newSlug = createSlug(newTitle);
    const bookRef = doc(firestore, 'books', book.id);
    try {
        await updateDoc(bookRef, {
            title: newTitle,
            slug: newSlug,
            updatedAt: serverTimestamp(),
        });
        setBook(prev => ({...prev, title: newTitle, slug: newSlug}));
        toast({ title: "Book title updated!" });
    } catch (e: any) {
        toast({ title: "Error Saving Title", description: e.message, variant: 'destructive' });
    }
  }

  const { wordCount, charCount } = useMemo(() => {
    if (!editor) return { wordCount: 0, charCount: 0 };
    const text = editor.getText();
    return {
      wordCount: text.trim().split(/\s+/).filter(Boolean).length,
      charCount: text.length,
    };
  }, [editor?.state]);

  const handleSaveContent = useCallback(async () => {
    if (!activeChapter || !book || !editor || saveStatus !== 'unsaved') return;
    setSaveStatus('saving');
    const content = editor.getHTML();
    
    try {
        const chapterRef = doc(firestore, 'books', book.id, 'chapters', activeChapter.id);
        await updateDoc(chapterRef, {
            content: content,
            wordCount: wordCount,
            updatedAt: serverTimestamp(),
        });
        
        setChapters(prev => {
            const newChapters = [...prev];
            newChapters[activeChapterIndex] = { ...newChapters[activeChapterIndex], content, wordCount };
            return newChapters;
        });

        setSaveStatus('saved');
    } catch (e: any) {
        setSaveStatus('unsaved');
        toast({ title: 'Error saving', description: e.message, variant: 'destructive' });
    }
  }, [editor, activeChapter, book, wordCount, firestore, activeChapterIndex, toast, saveStatus]);
  
  useEffect(() => {
    if (saveStatus === 'unsaved') {
      const timer = setTimeout(() => {
        handleSaveContent();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus, handleSaveContent]);

  useEffect(() => {
    if (editor && activeChapter) {
        if (editor.getHTML() !== activeChapter.content) {
            editor.commands.setContent(activeChapter.content, false);
            setSaveStatus('saved');
        }
    }
  }, [activeChapter, editor]);

  const handleExit = async () => {
    if (saveStatus === 'unsaved') {
      setShowExitDialog(true);
    } else {
      router.push('/write');
    }
  };

  const commandContext = useMemo((): CommandContext => ({
    editor,
    book,
    activeChapter,
  }), [editor, book, activeChapter]);

  const handlePrevChapter = () => {
    if (activeChapterIndex > 0) {
      handleSaveContent();
      setActiveChapterIndex(prev => prev - 1);
    }
  }
  
  const handleNextChapter = () => {
    if (activeChapterIndex < chapters.length - 1) {
      handleSaveContent();
      setActiveChapterIndex(prev => prev + 1);
    }
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <TopBar book={book} onExit={handleExit} saveStatus={saveStatus} editor={editor} onTitleChange={handleTitleChange} />
      <Ribbon commandContext={commandContext} />
      
      <main className="flex-1 overflow-y-auto bg-gray-800 p-4">
        <EditorSurface editor={editor} />
      </main>

       <footer className="flex h-[32px] flex-shrink-0 items-center justify-between border-t border-border bg-card px-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
                <Button onClick={handlePrevChapter} disabled={activeChapterIndex === 0} variant="ghost" size="sm" className="h-auto p-1">&lt; Prev</Button>
                <span>Page {activeChapterIndex + 1} of {chapters.length}</span>
                <Button onClick={handleNextChapter} disabled={activeChapterIndex === chapters.length - 1} variant="ghost" size="sm" className="h-auto p-1">Next &gt;</Button>
            </div>
            <div className="flex gap-4">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-auto py-0.5" onClick={openCommandPalette}>
                    <Wand2 className="mr-2 h-3 w-3" />
                    AI Ready
                </Button>
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
