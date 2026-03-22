import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SiteShell } from "@/components/layout/site-shell";
import { JournalWorkspace } from "@/components/journal/journal-workspace";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export default async function JournalPage() {
  const cookieStore = await cookies();
  if (!cookieStore.has(SESSION_COOKIE_NAME)) {
    redirect("/login");
  }

  return (
    <SiteShell>
      <section className="pb-5">
        <h1 className="font-serif text-5xl tracking-tight">Journal</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          FastAPI-backed journal flow with the same no-fluff writing style.
        </p>
      </section>

      <JournalWorkspace />
    </SiteShell>
  );
}
