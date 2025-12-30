
'use client';

import { Flame } from 'lucide-react';
import MainApp from '@/components/main-app';
import { Header } from '@/components/header';
import PageTransition from '@/components/page-transtion';

export default function AboutPage() {

  return (
    <MainApp>
        <>
            <Header />
            <main className="container mx-auto px-4 py-8">
                <PageTransition>
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <section>
                        <h1 className="font-headline text-6xl md:text-8xl font-extrabold text-foreground mb-24 tracking-tighter welcome-text">
                            About Venus Library
                        </h1>

                        <div className="max-w-3xl mx-auto space-y-6 text-lg text-foreground/90 leading-relaxed">
                            <p className="text-2xl font-semibold">
                            <strong>Turn your ideas into published books—effortlessly.</strong>
                            <Flame className="inline-block text-primary" />
                            </p>
                            <p>
                            This all-in-one platform empowers writers to create, publish, and sell books without jumping between tools or platforms. From your first sentence to your final sale, everything happens in a single app designed to keep you focused on what matters most: storytelling.
                            </p>
                            <p>
                            Write in a clean, distraction-free editor built for long-form creativity. Polish your work with built-in AI assistance that helps you brainstorm, edit, structure chapters, refine language, and overcome writer’s block—without taking control away from your voice.
                            </p>
                            <p>
                            When your book is ready, publish instantly to a global bookstore with just a few clicks. No waiting. No approvals. No confusing steps. Your work becomes available to readers worldwide in both digital and print formats.
                            </p>
                            <p>
                            With print-on-demand, your book is only printed when it’s ordered—no upfront costs, no wasted inventory. Real-time analytics give you clear insights into sales, readers, and performance, so you always know how your book is doing.
                            </p>
                            <p>
                            And most importantly, you keep 100% of your royalties. No subscriptions. No gatekeepers. No hidden cuts.
                            </p>
                            <p>
                            Just powerful tools, full ownership, and a simple path from idea to impact.
                            </p>
                        </div>
                        </section>
                    </div>
                </PageTransition>
            </main>
        </>
    </MainApp>
  );
}
