
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/icons';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from './ui/button';
import { Menu, Home, PenSquare, Info, Users, LifeBuoy, BookOpenCheck, Settings, LogOut, User as UserIcon, BookUser } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { UserBar } from './user-bar';
import { Separator } from './ui/separator';
import { useHeader } from '@/hooks/use-header';

const navItems = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/write', icon: PenSquare, label: 'Write' },
    { href: '/clubs', icon: BookUser, label: 'Clubs' },
    { href: '/community', icon: Users, label: 'Community' },
    { href: '/about', icon: Info, label: 'About' },
    { href: '/support', icon: LifeBuoy, label: 'Support' },
    { href: '/review', icon: BookOpenCheck, label: 'Review/Feedback' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { isMenuOpen, setMenuOpen } = useHeader();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      setMenuOpen(false);
      router.push('/login');
    }
  };

  const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void; }) => {
    const isActive = pathname === href;
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-md p-2 text-lg font-medium transition-colors hover:bg-muted ${isActive ? 'bg-muted text-primary' : ''}`}
            onClick={onClick}
        >
            {children}
        </Link>
    );
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-4">
          {isMounted && (
            <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                      <Logo className="h-8 w-8 text-primary" />
                      <span className="font-bold font-headline text-lg" style={{ color: '#D8B4FE' }}>Venus Library</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <Separator className="my-4" />
                <nav className="flex flex-col gap-4 p-4 pt-0">
                  {navItems.map(item => (
                    <NavLink key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </NavLink>
                  ))}
                  
                  <Separator className="my-4" />

                  <NavLink href="/settings/profile" onClick={() => setMenuOpen(false)}>
                      <UserIcon className="h-5 w-5" />
                      Edit Profile
                  </NavLink>
                  <NavLink href="/settings" onClick={() => setMenuOpen(false)}>
                      <Settings className="h-5 w-5" />
                      Settings
                  </NavLink>

                  <Separator className="my-4"/>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-md p-2 text-lg font-medium transition-colors text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-5 w-5" />
                    Log Out
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          )}
          
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-bold font-headline text-lg hidden md:inline-block" style={{ color: '#D8B4FE' }}>
              Venus Library
            </span>
          </Link>
        </div>
        <UserBar />
      </div>
    </header>
  );
}
