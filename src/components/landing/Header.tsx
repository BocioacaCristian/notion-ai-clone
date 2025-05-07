'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 backdrop-blur-md bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background font-bold text-lg">P</div>
              <span className="text-lg font-semibold">ProDoc</span>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink href="/" label="Home" active={pathname === '/'} />
            <NavLink href="/features" label="Features" active={pathname === '/features'} />
            <NavLink href="/templates" label="Templates" active={pathname === '/templates'} />
            <NavLink 
              href="/ai" 
              label={(
                <div className="flex items-center">
                  AI
                  <ChevronDown className="ml-1 h-3 w-3" />
                </div>
              )} 
              active={pathname?.startsWith('/ai')} 
            />
            <NavLink href="/todos" label="Todos" active={pathname?.startsWith('/todos')} />
          </nav>
          
          {/* Call to action */}
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Dashboard
              </Button>
            </Link>
            <Link href="/new">
              <Button className="shadow-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

type NavLinkProps = {
  href: string;
  label: React.ReactNode;
  active: boolean;
};

function NavLink({ href, label, active }: NavLinkProps) {
  return (
    <Link href={href}>
      <div className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active 
          ? 'bg-primary/5 text-primary' 
          : 'text-foreground/80 hover:text-foreground hover:bg-accent/50'
      }`}>
        {label}
      </div>
    </Link>
  );
} 