"use client";

import { ArrowLeft, ArrowUp, X } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { deleteProduct, saveProduct } from "@/app/admin/actions";
import { Photo } from "@/components/ui/photo";
import type { Category, Gender, Product } from "@/lib/types";
import { Card } from "./ui";

type Option = Pick<Product, "id" | "name" | "gender">;

export function ProductForm({ product, categories, others }: { product?: Product; categories: Category[]; others: Option[] }) {
  const [state, action, pending] = useActionState(saveProduct, undefined);
  const [gender, setGender] = useState<Gender>(product?.gender ?? "women");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [newUrl, setNewUrl] = useState("");
  const cats = categories.filter((c) => c.gender === gender).sort((a, b) => a.order - b.order);

  const move = (i: number) => setImages((list) => (i === 0 ? list : [...list.slice(0, i - 1), list[i], list[i - 1], ...list.slice(i + 1)]));

  return (
    <div className="max-w-4xl">
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-2 text-sm text-stone hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Products
      </Link>
      <h1 className="mb-6 font-display text-4xl">{product ? `Edit: ${product.name}` : "Add product"}</h1>

      <form action={action} className="space-y-5">
        <input type="hidden" name="id" value={product?.id ?? ""} />
        <input type="hidden" name="images" value={images.join("\n")} />

        <Card className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label" htmlFor="name">Product name *</label>
            <input id="name" name="name" required defaultValue={product?.name} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="brand">Brand</label>
            <input id="brand" name="brand" defaultValue={product?.brand ?? "Fashion Hub"} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="slug">URL slug (optional)</label>
            <input id="slug" name="slug" defaultValue={product?.slug} placeholder="auto from name" className="field" />
          </div>
          <div>
            <label className="label" htmlFor="gender">For *</label>
            <select id="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value as Gender)} className="field">
              <option value="women">Women</option>
              <option value="men">Men</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="categoryId">Category *</label>
            <select id="categoryId" name="categoryId" key={gender} defaultValue={product?.gender === gender ? product.categoryId : cats[0]?.id} className="field">
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.active ? "" : " (hidden)"}
                </option>
              ))}
            </select>
          </div>
        </Card>

        <Card className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div>
            <label className="label" htmlFor="price">Price (₹) *</label>
            <input id="price" name="price" type="number" min={1} required defaultValue={product?.price} className="field" inputMode="numeric" />
          </div>
          <div>
            <label className="label" htmlFor="mrp">MRP (₹)</label>
            <input id="mrp" name="mrp" type="number" min={1} defaultValue={product?.mrp} className="field" inputMode="numeric" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="label" htmlFor="stock">Stock *</label>
            <input id="stock" name="stock" type="number" min={0} required defaultValue={product?.stock ?? 10} className="field" inputMode="numeric" />
          </div>
          <div className="col-span-2 md:col-span-3">
            <label className="label" htmlFor="sizes">Sizes * (comma separated)</label>
            <input id="sizes" name="sizes" required defaultValue={product?.sizes.join(", ") ?? "S, M, L, XL"} className="field" />
          </div>
          <div className="col-span-2 md:col-span-3">
            <label className="label" htmlFor="colours">Colours (one per line, e.g. &quot;Maroon #5e1b26&quot;)</label>
            <textarea id="colours" name="colours" rows={3} defaultValue={product?.colours.map((c) => `${c.name} ${c.hex}`).join("\n")} className="field" />
          </div>
        </Card>

        <Card>
          <p className="label">Images * (first image is the cover)</p>
          <div className="flex flex-wrap gap-3">
            {images.map((src, i) => (
              <div key={src + i} className="relative h-32 w-24 overflow-hidden bg-sand">
                <Photo src={src} alt="" fill sizes="96px" />
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/50 p-1">
                  <button type="button" onClick={() => move(i)} disabled={i === 0} aria-label="Move earlier" className="text-white disabled:opacity-30">
                    <ArrowUp className="h-4 w-4 -rotate-90" />
                  </button>
                  <button type="button" onClick={() => setImages((l) => l.filter((_, k) => k !== i))} aria-label="Remove image" className="text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="uploads">Upload photos (JPG/PNG/WebP, max 6 MB each)</label>
              <input id="uploads" name="uploads" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="block w-full text-sm" />
            </div>
            <div>
              <label className="label" htmlFor="newUrl">…or add an image URL</label>
              <div className="flex">
                <input id="newUrl" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://…" className="field !border-r-0" />
                <button
                  type="button"
                  onClick={() => {
                    if (/^https:\/\//.test(newUrl.trim())) setImages((l) => [...l, newUrl.trim()]);
                    setNewUrl("");
                  }}
                  className="btn btn-dark !min-h-0 shrink-0 !px-4"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="grid gap-4">
          <div>
            <label className="label" htmlFor="description">Description</label>
            <textarea id="description" name="description" rows={4} defaultValue={product?.description} className="field" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="fabric">Fabric / material</label>
              <input id="fabric" name="fabric" defaultValue={product?.fabric} className="field" />
            </div>
            <div>
              <label className="label" htmlFor="care">Care instructions</label>
              <input id="care" name="care" defaultValue={product?.care ?? "Machine wash cold. Do not bleach. Warm iron."} className="field" />
            </div>
          </div>
        </Card>

        <Card>
          <p className="label">Show this product in</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {(
              [
                ["isNewArrival", "New Arrivals"],
                ["isTrending", "Trending"],
                ["isBestSeller", "Best Sellers"],
                ["isOnOffer", "Offers"],
                ["active", "Visible on website"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2">
                <input type="checkbox" name={key} defaultChecked={product ? product[key] : key === "active" || key === "isNewArrival"} className="h-4 w-4 accent-ink" />
                {label}
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <p className="label">Complete the look (optional)</p>
          <div className="grid max-h-56 gap-1.5 overflow-y-auto text-sm sm:grid-cols-2">
            {others
              .filter((o) => o.id !== product?.id && o.gender === gender)
              .map((o) => (
                <label key={o.id} className="flex items-center gap-2">
                  <input type="checkbox" name="completeTheLook" value={o.id} defaultChecked={product?.completeTheLook.includes(o.id)} className="h-4 w-4 accent-ink" />
                  {o.name}
                </label>
              ))}
          </div>
        </Card>

        {state?.error && <p role="alert" className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={pending} className="btn btn-dark">
            {pending ? "Saving…" : product ? "Save changes" : "Add product"}
          </button>
          {product && (
            <Link href={`/product/${product.slug}`} target="_blank" className="btn btn-outline">
              View on site
            </Link>
          )}
        </div>
      </form>

      {product && (
        <form
          action={deleteProduct.bind(null, product.id)}
          onSubmit={(e) => {
            if (!confirm(`Delete "${product.name}" permanently? Tip: untick "Visible on website" to just hide it.`)) e.preventDefault();
          }}
          className="mt-10 border-t border-line pt-6"
        >
          <button type="submit" className="text-sm text-red-700 underline">
            Delete this product
          </button>
        </form>
      )}
    </div>
  );
}
