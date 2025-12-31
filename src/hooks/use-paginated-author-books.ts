
'use client';

import { collection, query, where, getDocs, limit, startAfter, orderBy, type DocumentSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Book } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';

const PAGE_SIZE = 10;

export function usePaginatedAuthorBooks(authorId?: string) {
  const firestore = useFirestore();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = useCallback(async (startAfterDoc: DocumentSnapshot | null = null) => {
    if (!firestore || !authorId) {
        setLoading(false);
        return;
    }
    
    if (startAfterDoc === null) {
        setLoading(true);
    } else {
        setLoadingMore(true);
    }

    try {
      let q = query(
        collection(firestore, 'books'),
        where('authorId', '==', authorId),
        orderBy('updatedAt', 'desc'),
        limit(PAGE_SIZE)
      );

      if (startAfterDoc) {
          q = query(q, startAfter(startAfterDoc));
      }
      
      const documentSnapshots = await getDocs(q);
      const newBooks = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
      const lastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      
      setBooks(prev => startAfterDoc ? [...prev, ...newBooks] : newBooks);
      setLastVisible(lastDoc || null);
      setHasMore(newBooks.length === PAGE_SIZE);

    } catch (e) {
      console.error(e);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [firestore, authorId]);
  
  useEffect(() => {
    if (authorId) {
        // Reset and fetch when authorId changes
        setBooks([]);
        setLastVisible(null);
        setHasMore(true);
        fetchBooks();
    } else {
        // Clear data if no authorId
        setBooks([]);
        setLoading(false);
    }
  }, [authorId, fetchBooks]);

  const loadMore = () => {
      if (hasMore && !loadingMore && lastVisible) {
          fetchBooks(lastVisible);
      }
  }

  return { books, loading, loadingMore, hasMore, loadMore };
}
