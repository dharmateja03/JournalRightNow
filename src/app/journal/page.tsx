import { SiteShell } from "@/components/layout/site-shell";
import { JournalWorkspace } from "@/components/journal/journal-workspace";

export default function JournalPage() {
  return (
    <SiteShell>
      <section className="pb-5">
        <h1 className="font-serif text-5xl tracking-tight">Chronicle</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Login later if you want sync. For now your journal session works directly in-browser.
        </p>
      </section>

      <JournalWorkspace />
    </SiteShell>
  );
}
