import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { SiteShell } from "@/components/layout/site-shell";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export default async function LoginPage() {
  const cookieStore = await cookies();
  if (cookieStore.has(SESSION_COOKIE_NAME)) {
    redirect("/journal");
  }

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-md border-2 border-border bg-card p-8 sm:p-10">
        <h1 className="font-serif text-4xl tracking-tight">Log in</h1>
        <p className="mt-3 text-muted-foreground">Use your email and password to continue.</p>
        <LoginForm />
      </section>
    </SiteShell>
  );
}
