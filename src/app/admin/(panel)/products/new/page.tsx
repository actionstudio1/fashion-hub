import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";
import { readDbAsAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Add product" };

export default async function NewProductPage() {
  const db = await readDbAsAdmin({ orders: false });
  return <ProductForm categories={db.categories} others={db.products.map(({ id, name, gender }) => ({ id, name, gender }))} />;
}
