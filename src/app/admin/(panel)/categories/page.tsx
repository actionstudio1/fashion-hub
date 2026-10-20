import type { Metadata } from "next";
import { CategoryManager } from "@/components/admin/category-manager";
import { AdminHeader } from "@/components/admin/ui";
import { readDbAsAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategories() {
  const db = await readDbAsAdmin({ orders: false });
  const rows = db.categories.map((c) => ({ ...c, count: db.products.filter((p) => p.categoryId === c.id).length }));
  return (
    <>
      <AdminHeader title="Categories" subtitle="Add, rename, reorder or hide categories. Categories with no products stay hidden on the website automatically." />
      <CategoryManager rows={rows} />
    </>
  );
}
