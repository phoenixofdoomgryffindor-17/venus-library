
'use client';

import ReaderDashboard from '../(main)/reader-dashboard';
import MainApp from '@/components/main-app';
import { Header } from '@/components/header';

export default function MarketplacePage() {
  return (
    <MainApp>
        <>
            <Header />
            <main className="container mx-auto px-4 py-8">
                <section className="mb-12">
                    <h1 className="font-headline text-5xl font-bold text-primary mb-2">Marketplace</h1>
                    <p className="text-xl text-muted-foreground">Discover your next favorite book.</p>
                </section>
                <ReaderDashboard />
            </main>
        </>
    </MainApp>
  );
}
