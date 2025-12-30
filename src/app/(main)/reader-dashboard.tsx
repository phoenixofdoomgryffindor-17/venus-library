
'use client';

import type { Book, User } from '@/lib/types';
import { BookCard } from '@/components/book-card';
import { Loader2, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePaginatedBooks } from '@/hooks/use-paginated-books';

export default function ReaderDashboard() {
  const { books, authors, loading, loadingMore, hasMore, loadMore } = usePaginatedBooks();

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col h-96 items-center justify-center text-center bg-card/30 rounded-lg">
        <Inbox className="h-16 w-16 text-muted-foreground" />
        <h3 className="mt-4 text-2xl font-semibold">No Books in the Marketplace</h3>
        <p className="mt-2 text-muted-foreground">Check back later for new releases!</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map(book => (
            <BookCard key={book.id} book={book} author={authors[book.authorId]} />
          ))}
        </div>
      </section>

      {hasMore && (
        <section className="text-center">
          <Button onClick={loadMore} disabled={loadingMore} variant="outline" size="lg">
            {loadingMore ? <Loader2 className="animate-spin" /> : 'Load More'}
          </Button>
        </section>
      )}
    </div>
  );
}
