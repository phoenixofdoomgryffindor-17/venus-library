'use client';

import { useUser } from "@/firebase";

export function WelcomeHeader() {
    const { user } = useUser();
    const welcomeMessage = user ? `Welcome back, ${user.displayName || 'Reader'}!` : 'Welcome to Venus Library';
    
    return (
        <h1 className="font-headline text-5xl font-bold mb-2">{welcomeMessage}</h1>
    )
}