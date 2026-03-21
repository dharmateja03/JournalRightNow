import Link from "next/link";

import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Clean",
    text: "Minimal interface that stays out of your way.",
  },
  {
    title: "No account needed",
    text: "Use local journals without signing in. Data can live entirely in your browser.",
  },
  {
    title: "Use anywhere",
    text: "Add account sync later when you want multi-device access.",
  },
  {
    title: "Privacy first",
    text: "No ads. No algorithmic feed. Just your own day logs.",
  },
  {
    title: "Dark only",
    text: "Built for low-light journaling with high contrast and restrained accents.",
  },
  {
    title: "Export",
    text: "Download journal entries as Markdown or JSON.",
  },
];

export default function HomePage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden border-2 border-border bg-card px-6 py-10 sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,hsl(var(--accent)/0.18),transparent_45%),radial-gradient(circle_at_80%_100%,hsl(var(--accent)/0.12),transparent_40%)]" />

        <div className="relative flex flex-col gap-6">
          <Badge className="w-fit border-accent/60 text-accent">No-Nonsense Journaling</Badge>

          <h1 className="max-w-2xl font-serif text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            Chronicle-style daily highlights without the fluff.
          </h1>

          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            JournalRightNow is a lightweight daily journal where each entry is short,
            direct, and focused on what actually mattered in your day.
          </p>

          <div>
            <Link href="/journal" className={buttonVariants({ className: "px-5 py-2.5 text-base" })}>
              Start Journaling
            </Link>
          </div>
        </div>
      </section>

      <section className="pt-10 sm:pt-14">
        <div className="mb-6 space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl">Features</h2>
          <p className="max-w-xl text-muted-foreground">
            Entries are designed to stay brief and useful, closer to daily highlights than
            long-form diary writing.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  {feature.text}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
