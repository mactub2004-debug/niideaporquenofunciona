'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, List, User, Scan } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/list', label: 'List', icon: List },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  const leftItems = navItems.slice(0, 2);
  const rightItems = navItems.slice(2);

  const renderNavItem = (item: typeof navItems[0]) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.label}
        href={item.href}
        className={cn(
          'flex flex-col items-center gap-1 p-2 rounded-md transition-colors text-muted-foreground hover:text-primary w-16',
          isActive && 'text-primary'
        )}
      >
        <item.icon className="h-6 w-6" />
        <span className="text-xs font-medium">{item.label}</span>
      </Link>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t z-10 mx-auto max-w-md">
      <nav className="flex h-full items-center justify-around relative">
        {leftItems.map(renderNavItem)}
        <div className="w-16 h-16"></div> {/* Placeholder for the FAB */}
        {rightItems.map(renderNavItem)}
      </nav>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <Button asChild size="icon" className="w-16 h-16 rounded-full shadow-lg">
          <Link href="/scan">
            <Scan className="h-8 w-8" />
            <span className="sr-only">Scan</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
