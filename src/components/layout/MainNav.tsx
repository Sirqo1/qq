"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutGrid, PlusCircle, Search, Zap } from 'lucide-react';

const navItems = [
  { href: '/decks', label: 'Decks', icon: <LayoutGrid size={18} /> },
  { href: '/decks/new', label: 'New Deck', icon: <PlusCircle size={18} /> },
  { href: '/search', label: 'Search', icon: <Search size={18} /> },
  { href: '/practice', label: 'Practice', icon: <Zap size={18} /> },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-2 md:space-x-4">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          asChild
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <Link href={item.href} className="flex items-center gap-2">
            {item.icon}
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
}
