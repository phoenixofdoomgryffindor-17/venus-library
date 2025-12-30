
import type { Metadata } from 'next';
import { Inter, Playfair_Display, PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-playfair' });
const ptSans = PT_Sans({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-pt-sans'});

export const metadata: Metadata = {
  title: 'Gemini Books',
  description: 'Your AI-powered library and authoring studio.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${ptSans.variable}`} suppressHydrationWarning>
      <body>
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
