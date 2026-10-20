import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminNav, AdminNavView } from "@/components/admin/admin-nav";
import { isAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Fashion Hub Admin" }, robots: { index: false, follow: false } };

/** Second line of defence behind proxy.ts: never render admin data without a valid session. */
async function Gate({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) {
    return (
      <p className="text-sm">
        Your session has expired. <Link href="/admin/login" className="underline">Log in again</Link>.
      </p>
    );
  }
  return <>{children}</>;
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh bg-[#f4f1ec] md:flex">
      <Suspense fallback={<AdminNavView pathname="" />}>
        <AdminNav />
      </Suspense>
      <main className="min-w-0 flex-1 px-4 py-6 md:px-10 md:py-10">
        <Suspense fallback={<p className="text-sm text-stone">Loading…</p>}>
          <Gate>{children}</Gate>
        </Suspense>
      </main>
    </div>
  );
}
