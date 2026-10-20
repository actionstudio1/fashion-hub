import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/settings-form";
import { AdminHeader } from "@/components/admin/ui";
import { readDbAsAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettings() {
  const { settings } = await readDbAsAdmin({ orders: false });
  return (
    <>
      <AdminHeader title="Settings" subtitle="Delivery charges and the announcement bar at the top of the website." />
      <SettingsForm settings={settings} />
    </>
  );
}
