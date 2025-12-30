
'use client';

import AuthorDashboard from '../(main)/author-dashboard';
import MainApp from '@/components/main-app';
import { Header } from '@/components/header';

export default function WritePage() {
  return (
    <MainApp>
        <Header />
        <main className="container mx-auto px-4 py-8">
            <section className="mb-12">
                <h1 className="font-headline text-5xl font-bold text-primary mb-2">Author Studio</h1>
                <p className="text-xl text-muted-foreground">Manage your creative works.</p>
            </section>
            <AuthorDashboard />
        </main>
    </MainApp>
  );
}

    