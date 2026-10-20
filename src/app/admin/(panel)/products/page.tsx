import type { Metadata } from "next";
import Link from "next/link";
import { toggleProductFlag } from "@/app/admin/actions";
import { AdminHeader, Card } from "@/components/admin/ui";
import { Photo } from "@/components/ui/photo";
import { readDbAsAdmin } from "@/lib/auth";
import { formatINR } from "@/lib/format";
import type { Product } from "@/lib/types";

export const metadata: Metadata = { title: "Products" };

const FLAGS: { key: "isNewArrival" | "isTrending" | "isBestSeller" | "isOnOffer" | "active"; label: string }[] = [
  { key: "isNewArrival", label: "New" },
  { key: "isTrending", label: "Trending" },
  { key: "isBestSeller", label: "Best" },
  { key: "isOnOffer", label: "Offer" },
  { key: "active", label: "Live" },
];

function FlagToggle({ product, flag, label }: { product: Product; flag: (typeof FLAGS)[number]["key"]; label: string }) {
  const on = product[flag];
  return (
    <form action={toggleProductFlag.bind(null, product.id, flag)}>
      <button
        type="submit"
        title={`${on ? "Remove" : "Mark as"} ${label}`}
        className={`rounded-full border px-2.5 py-1 text-[0.7rem] transition ${on ? "border-ink bg-ink text-cream" : "border-line text-stone hover:border-ink"}`}
      >
        {label}
      </button>
    </form>
  );
}

export default async function AdminProducts(props: PageProps<"/admin/products">) {
  const sp = await props.searchParams;
  const q = String(sp.q ?? "").toLowerCase().trim();
  const gender = String(sp.gender ?? "");
  const filter = String(sp.filter ?? "");
  const db = await readDbAsAdmin({ orders: false });
  const catName = (id: string) => db.categories.find((c) => c.id === id)?.name ?? "—";

  const products = db.products
    .filter((p) => !q || `${p.name} ${p.brand} ${catName(p.categoryId)}`.toLowerCase().includes(q))
    .filter((p) => !gender || p.gender === gender)
    .filter((p) => (filter === "out" ? p.stock <= 0 : filter === "hidden" ? !p.active : true));

  return (
    <>
      <AdminHeader title="Products" subtitle={`${db.products.length} products · tap a tag to switch it on/off`} action={{ label: "+ Add product", href: "/admin/products/new" }} />
      {sp.saved && <p className="mb-4 rounded-sm bg-emerald-50 px-4 py-2 text-sm text-emerald-700">Product saved.</p>}

      <form className="mb-4 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Search products…" className="field !w-auto flex-1 !py-2" />
        <select name="gender" defaultValue={gender} className="field !w-auto !py-2">
          <option value="">All</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
        </select>
        <select name="filter" defaultValue={filter} className="field !w-auto !py-2">
          <option value="">Any stock</option>
          <option value="out">Out of stock</option>
          <option value="hidden">Hidden</option>
        </select>
        <button className="btn btn-dark !min-h-10">Filter</button>
      </form>

      <Card className="!p-0">
        <ul className="divide-y divide-line">
          {products.map((p) => (
            <li key={p.id} className={`flex flex-col gap-3 p-4 md:flex-row md:items-center ${p.active ? "" : "opacity-60"}`}>
              <Link href={`/admin/products/${p.id}`} className="flex flex-1 items-center gap-4">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-sand">
                  <Photo src={p.images[0]} alt="" fill sizes="48px" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium hover:underline">{p.name}</p>
                  <p className="text-xs text-stone">
                    {p.gender === "men" ? "Men" : "Women"} · {catName(p.categoryId)} · {formatINR(p.price)}
                    {p.mrp > p.price && <span className="line-through"> {formatINR(p.mrp)}</span>}
                  </p>
                  <p className={`text-xs ${p.stock <= 0 ? "text-sale" : p.stock <= 5 ? "text-amber-700" : "text-stone"}`}>
                    {p.stock <= 0 ? "Out of stock" : `${p.stock} in stock`}
                  </p>
                </div>
              </Link>
              <div className="flex flex-wrap gap-1.5">
                {FLAGS.map((f) => (
                  <FlagToggle key={f.key} product={p} flag={f.key} label={f.label} />
                ))}
              </div>
            </li>
          ))}
          {products.length === 0 && <li className="p-6 text-sm text-stone">No products match.</li>}
        </ul>
      </Card>
    </>
  );
}
