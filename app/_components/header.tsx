'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Triad Accessible Homes"
            width={200}
            height={60}
            className="h-14 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 md:flex">
          <Link href="/">
            <Button variant="ghost" size="sm">Home</Button>
          </Link>
          <Link href="/#categories">
            <Button variant="ghost" size="sm">Categories</Button>
          </Link>
          <Link href="/locations">
            <Button variant="ghost" size="sm">Locations</Button>
          </Link>
          <Link href="/guides">
            <Button variant="ghost" size="sm">Guides</Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" size="sm">Admin</Button>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-muted">Home</Link>
          <Link href="/#categories" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-muted">Categories</Link>
          <Link href="/locations" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-muted">Locations</Link>
          <Link href="/guides" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-muted">Guides</Link>
          <Link href="/admin" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-muted">Admin</Link>
        </nav>
      )}
    </header>
  );
}
