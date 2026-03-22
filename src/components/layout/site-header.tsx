import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-3xl font-serif leading-none text-foreground transition-colors hover:text-accent"
          aria-label="JournalRightNow home"
        >
          •
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link className="px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground" href="/journal">
            journal
          </Link>
          <Link className="px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground" href="/faq">
            faq
          </Link>
          <Link className="px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground" href="/profile">
            profile
          </Link>
          <Link className="px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground" href="/login">
            login
          </Link>
        </nav>
      </div>
    </header>
  );
}
