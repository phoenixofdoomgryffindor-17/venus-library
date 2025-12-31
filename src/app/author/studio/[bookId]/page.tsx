
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useCollection } from '@/firebase/firestore/use-collection';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import type { Book, Chapter } from '@/lib/types';
import StudioShell from '@/app/(main)/studio/StudioShell';
import '@/styles/editor-loader.css';

type Stage = 'boot' | 'firebase' | 'document' | 'editor' | 'ui' | 'done';

const STAGE_PROGRESS: Record<Stage, number> = {
  boot: 5,
  firebase: 30,
  document: 55,
  editor: 75,
  ui: 95,
  done: 100,
};

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function EditorLoader({
  progress,
  done,
  onCancel,
}: {
  progress: number;
  done: boolean;
  onCancel: () => void;
}) {
  return (
    <div className={`editor-loader ${done ? 'fade-out' : ''}`}>
      <div className="top-bar">
        <div style={{ width: `${progress}%` }} />
      </div>

      {!done ? (
        <>
          <h1>LOADING EDITOR</h1>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </>
      ) : (
        <div className="success-check">✓</div>
      )}
    </div>
  );
}

export default function AuthorStudioPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const firestore = useFirestore();
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  const [stage, setStage] = useState<Stage>('boot');
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const bookRef = useMemoFirebase(
    () => (firestore && bookId ? doc(firestore, 'books', bookId) : null),
    [firestore, bookId]
  );

  const chaptersQuery = useMemoFirebase(
    () =>
      firestore && bookId
        ? query(collection(firestore, 'books', bookId, 'chapters'), orderBy('order'))
        : null,
    [firestore, bookId]
  );

  const { data: book, isLoading: bookLoading } = useDoc<Book>(bookRef);
  const { data: chapters, isLoading: chaptersLoading } =
    useCollection<Chapter>(chaptersQuery);
  const loading = userLoading || bookLoading || chaptersLoading;

  useEffect(() => {
    const target = STAGE_PROGRESS[stage];
    const id = setInterval(() => {
      setProgress((p) => (p < target ? p + 1 : p));
    }, 16);
    return () => clearInterval(id);
  }, [stage]);

  useEffect(() => {
    if (cancelled) return;

    if (loading) {
      setStage('firebase');
      return;
    }

    if (book && chapters) {
      setStage('document');
      // Simulate editor and UI loading after data is fetched
      const finishLoading = async () => {
        await wait(400);
        if (cancelled) return;
        setStage('editor');
        await wait(400);
        if (cancelled) return;
        setStage('ui');
        await wait(200);
        setStage('done');
        setTimeout(() => setReady(true), 500);
      };
      finishLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelled, loading, book, chapters]);

  if (!loading && (!book || book.authorId !== user?.uid)) {
    notFound();
  }

  return (
    <>
      {!ready && !cancelled && (
        <EditorLoader
          progress={progress}
          done={stage === 'done'}
          onCancel={() => {
            setCancelled(true);
            router.back();
          }}
        />
      )}

      {ready && !cancelled && book && chapters && (
        <StudioShell book={book} initialChapters={chapters} />
      )}
    </>
  );
}
