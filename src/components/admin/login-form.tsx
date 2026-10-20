"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus className="field" />
      </div>
      {state?.error && <p className="text-sm text-sale">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-dark w-full">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
