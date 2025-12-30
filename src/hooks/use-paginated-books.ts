
'use client';

import { collection, query, where, getDocs, documentId, limit, startAfter, orderBy, type DocumentSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Book, User } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';

const DEFAULT_PAGE_SIZE = 8;

export function usePaginatedBooks(pageSize: number = DEFAULT_PAGE_SIZE) {
  const firestore = useFirestore();
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchAuthors = useCallback(async (newBooks: Book[], currentAuthors: Record<string, User>): Promise<Record<string, User>> => {
    if (!firestore || newBooks.length === 0) return {};

    const authorIdsToFetch = [...new Set(newBooks.map(book => book.authorId).filter(id => id && !currentAuthors[id]))];
    
    if (authorIdsToFetch.length === 0) return {};

    const usersRef = collection(firestore, 'users');
    const newAuthors: Record<string, User> = {};
    
    // Firestore 'in' query is limited to 30 values, so we chunk the requests.
    for (let i = 0; i < authorIdsToFetch.length; i += 30) {
        const chunk = authorIdsToFetch.slice(i, i + 30);
        try {
            const authorQuery = query(usersRef, where('uid', 'in', chunk));
            const authorSnapshots = await getDocs(authorQuery);
            authorSnapshots.forEach(doc => {
                const userData = doc.data() as User;
                newAuthors[userData.uid] = userData;
            });
        } catch (error) {
            console.error("Error fetching authors chunk:", error);
        }
    }
    
    return newAuthors;
  }, [firestore]);

  const fetchInitialBooks = useCallback(async () => {
    if (!firestore) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(firestore, 'books'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
      
      const documentSnapshots = await getDocs(q);
      const newBooks = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
      const lastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      
      const fetchedAuthors = await fetchAuthors(newBooks, {});
      
      setBooks(newBooks);
      setAuthors(fetchedAuthors);
      setLastVisible(lastDoc || null);
      setHasMore(newBooks.length === pageSize);
    } catch (e) {
      console.error(e);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [firestore, pageSize, fetchAuthors]);
  
  const loadMore = useCallback(async () => {
    if (!firestore || !lastVisible || loadingMore) return;
    
    setLoadingMore(true);
    try {
        const q = query(
            collection(firestore, 'books'),
            where('status', '==', 'published'),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(pageSize)
        );

        const documentSnapshots = await getDocs(q);
        const newBooks = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
        const lastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];

        const newAuthors = await fetchAuthors(newBooks, authors);

        setBooks(prev => [...prev, ...newBooks]);
        setAuthors(prev => ({ ...prev, ...newAuthors }));
        setLastVisible(lastDoc || null);
        setHasMore(newBooks.length === pageSize);
    } catch (e) {
        console.error(e);
        setHasMore(false);
    } finally {
        setLoadingMore(false);
    }
  }, [firestore, lastVisible, loadingMore, pageSize, fetchAuthors, authors]);

  useEffect(() => {
    fetchInitialBooks();
  }, [fetchInitialBooks]); 

  return { books, authors, loading, loadingMore, hasMore, loadMore };
}
