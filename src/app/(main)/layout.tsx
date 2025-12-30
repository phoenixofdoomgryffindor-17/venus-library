
'use client';
import { Suspense } from 'react';
import { Header } from '@/components/header';
import MainApp from '@/components/main-app';
import PageTransition from '@/components/page-transtion';
import { Loader2 } from 'lucide-react';

export default function MainLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <MainApp>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          }
        >
          <PageTransition>{children}</PageTransition>
        </Suspense>
      </main>
    </MainApp>
  );
}

    