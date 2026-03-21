import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-border pt-10 pb-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center justify-between gap-4 px-4 text-sm sm:flex-row sm:px-6">
        <p className="text-muted-foreground">
          Created with <span className="text-accent">heart</span> by journalrightnow
        </p>

        <div className="flex flex-wrap justify-center gap-1 lowercase">
          <Link className="px-3 py-1 transition-colors hover:bg-accent hover:text-accent-foreground" href="/profile">
            profile
          </Link>
          <Link className="px-3 py-1 transition-colors hover:bg-accent hover:text-accent-foreground" href="/privacy">
            privacy
          </Link>
          <Link className="px-3 py-1 transition-colors hover:bg-accent hover:text-accent-foreground" href="/terms">
            terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
