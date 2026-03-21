import { SiteShell } from "@/components/layout/site-shell";

export default function FaqPage() {
  return (
    <SiteShell>
      <section className="border-2 border-border bg-card p-8 sm:p-10">
        <h1 className="font-serif text-4xl">FAQ</h1>
        <p className="mt-3 text-muted-foreground">This page is intentionally minimal for now.</p>
      </section>
    </SiteShell>
  );
}
