"use client";

import { useActionState } from "react";

import { login, type LoginFormState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const INITIAL_STATE: LoginFormState = {};

export function LoginForm() {
  const [state, action, isPending] = useActionState(login, INITIAL_STATE);

  return (
    <form action={action} className="mt-6 space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm text-muted-foreground">
          Email
        </label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm text-muted-foreground">
          Password
        </label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>

      {state.error ? <p className="text-sm text-red-300">{state.error}</p> : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
