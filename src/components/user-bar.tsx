
"use client";

import { UserNav } from '@/components/user-nav';
import { useUser } from '@/firebase';
import { useOnboarding } from '@/hooks/use-onboarding';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export function UserBar() {
  const router = useRouter();
  const { user, loading } = useUser();
  const { needsOnboarding } = useOnboarding(user);
  
  if (loading || !user) return null;

  return (
    <div className="flex items-center gap-4">
        {needsOnboarding && (
          <Button
            variant="secondary"
            className="rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-500 hidden sm:flex"
            onClick={() => router.push('/settings/profile')}
          >
            Complete your profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      <UserNav />
    </div>
  );
}
