
'use client';

import ReaderDashboard from '../(main)/reader-dashboard';
import MainApp from '@/components/main-app';
import { Header } from '@/components/header';
import { useUser } from '@/firebase';

export default function HomePage() {
  const { user } = useUser();
  const welcomeMessage = user ? `Welcome, ${user.displayName || 'Reader'}!` : 'Welcome to the Marketplace';

  return (
    <MainApp>
        <>
            <Header />
            <main className="container mx-auto px-4 py-8">
                <section className="text-center mb-12">
                    <h1 className="font-headline text-5xl font-bold text-primary mb-2">{welcomeMessage}</h1>
                    <p className="text-xl text-muted-foreground">Discover your next favorite book.</p>
                </section>
                <ReaderDashboard />
            </main>
        </>
    </MainApp>
  );
}
