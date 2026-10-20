import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { readDbAsAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage(props: PageProps<"/admin/products/[id]">) {
  const { id } = await props.params;
  const db = await readDbAsAdmin({ orders: false });
  const product = db.products.find((p) => p.id === id);
  if (!product) notFound();
  return <ProductForm key={product.id} product={product} categories={db.categories} others={db.products.map(({ id, name, gender }) => ({ id, name, gender }))} />;
}
