import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Triad Accessible Homes"
              width={160}
              height={48}
              className="h-12 w-auto"
            />
          </Link>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/#categories" className="hover:text-primary transition-colors">Categories</Link>
            <Link href="/locations" className="hover:text-primary transition-colors">Locations</Link>
            <Link href="/guides" className="hover:text-primary transition-colors">Guides</Link>
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Helping families find disability-accessible home service providers in the Piedmont Triad.
        </p>
      </div>
    </footer>
  );
}