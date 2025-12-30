
'use client';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/header';
import MainApp from '@/components/main-app';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactElement;
}) {

  return (
    <MainApp>
      <>
        <Header />
        <main className="container mx-auto max-w-3xl py-12 px-4">
          <Suspense fallback={
              <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
          }>
              {children}
          </Suspense>
        </main>
      </>
    </MainApp>
  );
}
