
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { Book, User } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';

interface BookCardProps {
  book: Book;
  author?: User;
}

function AuthorName({ author }: { author?: User }) {
  if (!author) {
    return <Skeleton className="h-4 w-24 mt-1" />;
  }
  return <p className="text-sm font-medium text-white/80 truncate">{author?.displayName || 'Unknown Author'}</p>;
}

export function BookCard({ book, author }: BookCardProps) {
  const bookUrl = `/books/${book.slug || book.id}`;
  return (
    <Link href={bookUrl} className="group">
      <Card className="w-[265px] h-[400px] overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
        <div className="relative w-full h-full">
            <Image
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint="book cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <h3 className="font-headline text-2xl text-white font-bold truncate group-hover:text-primary transition-colors">{book.title}</h3>
                <AuthorName author={author} />
                {(book.ratingAvg ?? 0) > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <span className="text-white font-bold">{book.ratingAvg?.toFixed(1)}</span>
                    </div>
                )}
            </div>
        </div>
      </Card>
    </Link>
  );
}
