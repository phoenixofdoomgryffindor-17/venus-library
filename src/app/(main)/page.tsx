
'use client';

import { collection, query, where, orderBy, limit, getDocs, getFirestore } from 'firebase/firestore';
import { initializeFirebase, useFirestore } from '@/firebase';
import { getApps } from 'firebase/app';
import type { Book } from '@/lib/types';
import ReaderDashboard from './reader-dashboard';
import { Button } from '@/components/ui/button';
import { BookHeart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { WelcomeHeader } from '@/components/welcome-header';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [featuredBook, setFeaturedBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    async function getFeaturedBook() {
      if (!firestore) return;

      const booksRef = collection(firestore, 'books');
      const q = query(
        booksRef,
        where('status', '==', 'published'),
        where('appreciations', '>', 100),
        orderBy('appreciations', 'desc'),
        limit(1)
      );

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const bookDoc = querySnapshot.docs[0];
          setFeaturedBook({ id: bookDoc.id, ...bookDoc.data() } as Book);
        }
      } catch (error) {
        console.error("Error fetching featured book:", error);
        // This might fail if the index isn't created, but we don't want to crash the page.
        setFeaturedBook(null);
      } finally {
        setLoading(false);
      }
    }

    getFeaturedBook();
  }, [firestore]);


  return (
    <div className="space-y-12">
        <section className="text-center pt-16">
            <WelcomeHeader />
            <p className="text-xl text-muted-foreground">Discover your next favorite book from our growing collection.</p>
        </section>

        {loading ? (
           <div className="flex items-center justify-center h-64">
             <Loader2 className="h-12 w-12 animate-spin text-primary" />
           </div>
        ) : featuredBook && (
          <section className="bg-card/30 rounded-xl p-8 md:p-12 border border-border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                 <Image 
                  src={featuredBook.coverUrl}
                  alt={`Cover for ${featuredBook.title}`}
                  fill
                  className="object-cover"
                  data-ai-hint="fantasy landscape"
                 />
              </div>
              <div>
                <h2 className="text-sm uppercase text-primary font-semibold tracking-wider">Featured Story</h2>
                <h3 className="font-headline text-4xl font-bold mt-2">{featuredBook.title}</h3>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  {featuredBook.description}
                </p>
                <Button asChild size="lg" className="mt-6">
                  <Link href={`/books/${featuredBook.slug}`}>
                    <BookHeart className="mr-2"/>
                    Start Reading
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}
        
        <ReaderDashboard />
        
    </div>
  );
}
