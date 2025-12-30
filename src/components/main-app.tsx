
'use client';

import { useRequireUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { HeaderProvider } from '@/hooks/use-header';

const AUTH_ROUTES = ['/login', '/signup'];

export default function MainApp({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  
  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <HeaderProvider>
      <AuthenticatedApp>{children}</AuthenticatedApp>
    </HeaderProvider>
  );
}

function AuthenticatedApp({ children }: { children: ReactNode }) {
    const { user, loading: userLoading } = useRequireUser();

    if (userLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
             <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
}
