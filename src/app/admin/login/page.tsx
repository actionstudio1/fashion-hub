import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { adminPassword } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

/** Checked per request: on Firebase the password is a runtime-only secret. */
async function LoginBody() {
  await connection();
  if (adminPassword()) return <LoginForm />;
  return (
    <p className="mt-8 text-sm text-stone">
      Admin login is disabled. Set <code className="bg-sand px-1">ADMIN_PASSWORD</code> in your environment (see <code className="bg-sand px-1">.env.example</code>) and restart the server.
    </p>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-4">
      <div className="w-full max-w-sm bg-cream p-8">
        <p className="text-center font-display text-2xl tracking-[0.3em]">
          FASHION<span className="text-gold">·</span>HUB
        </p>
        <p className="eyebrow mt-2 text-center text-stone">Store admin</p>
        <Suspense fallback={<div className="mt-8 h-28" />}>
          <LoginBody />
        </Suspense>
      </div>
    </main>
  );
}
