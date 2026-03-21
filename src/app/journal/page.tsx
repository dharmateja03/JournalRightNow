import { SiteShell } from "@/components/layout/site-shell";

export default function JournalPage() {
  return (
    <SiteShell>
      <section className="border-2 border-border bg-card p-8 sm:p-10">
        <h1 className="font-serif text-4xl">Journal</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Journal editor and timeline will be completed in feature issues #2 and #3.
        </p>
      </section>
    </SiteShell>
  );
}
