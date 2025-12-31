
'use client';

import ReaderDashboard from './reader-dashboard';
import { Button } from '@/components/ui/button';
import { useHeader } from '@/hooks/use-header';
import { Menu, BookHeart } from 'lucide-react';
import { useUser } from '@/firebase';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const { setMenuOpen } = useHeader();
  const { user } = useUser();
  
  const welcomeMessage = user ? `Welcome back, ${user.displayName || 'Reader'}!` : 'Welcome to Venus Library';

  return (
    <div className="space-y-12">
        <section className="text-center pt-16">
            <h1 className="font-headline text-5xl font-bold mb-2">{welcomeMessage}</h1>
            <p className="text-xl text-muted-foreground">Discover your next favorite book from our growing collection.</p>
        </section>

        <section className="bg-card/30 rounded-xl p-8 md:p-12 border border-border">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
               <Image 
                src="https://picsum.photos/seed/featured-book/800/600"
                alt="Featured Book"
                fill
                className="object-cover"
                data-ai-hint="fantasy landscape"
               />
            </div>
            <div>
              <h2 className="text-sm uppercase text-primary font-semibold tracking-wider">Featured Story</h2>
              <h3 className="font-headline text-4xl font-bold mt-2">The Last Dragon of Eldoria</h3>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                In a world where magic is fading, a young blacksmith discovers an ancient secret that could either save her world or shatter it completely. An epic fantasy of courage, sacrifice, and the enduring power of hope.
              </p>
              <Button asChild size="lg" className="mt-6">
                <Link href="/books/the-last-dragon-of-eldoria-12345">
                  <BookHeart className="mr-2"/>
                  Start Reading
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <ReaderDashboard />
        
        <section className="text-center py-8">
            <p className="text-muted-foreground mb-4">Looking for something else?</p>
            <Button variant="outline" onClick={() => setMenuOpen(true)}>
              <Menu className="mr-2" />
              Explore Menu
            </Button>
        </section>
    </div>
  );
}
