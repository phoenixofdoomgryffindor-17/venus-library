
'use client';

import ReaderDashboard from './reader-dashboard';
import { Button } from '@/components/ui/button';
import { useHeader } from '@/hooks/use-header';
import { Menu } from 'lucide-react';
import { useUser } from '@/firebase';
import Link from 'next/link';

export default function HomePage() {
  const { setMenuOpen } = useHeader();
  const { user } = useUser();
  
  const welcomeMessage = user ? `Welcome, ${user.displayName || 'Reader'}!` : 'Welcome to the Marketplace';

  return (
    <div className="space-y-12">
        <section className="text-center pt-16">
            <h1 className="font-headline text-5xl font-bold mb-2">{welcomeMessage}</h1>
            <p className="text-xl text-muted-foreground">Discover your next favorite book.</p>
        </section>
        <ReaderDashboard />
        <section className="text-center py-8">
            <p className="text-muted-foreground mb-4">Not interested? Check out other options</p>
            <Button variant="outline" onClick={() => setMenuOpen(true)}>
              <Menu className="mr-2" />
              Menu
            </Button>
        </section>
    </div>
  );
}

    
