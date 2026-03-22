import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { logout } from "@/app/login/actions";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (!session) {
    redirect("/login");
  }

  return (
    <SiteShell>
      <section className="border-2 border-border bg-card p-8 sm:p-10">
        <h1 className="font-serif text-4xl">Profile</h1>
        <p className="mt-3 text-muted-foreground">Signed in as {session.value}</p>
        <form action={logout} className="mt-6">
          <Button type="submit" variant="outline">
            Log out
          </Button>
        </form>
      </section>
    </SiteShell>
  );
}
