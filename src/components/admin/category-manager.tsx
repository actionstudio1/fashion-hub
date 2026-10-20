"use client";

import { ChevronDown, ChevronUp, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { useActionState, useState, useTransition } from "react";
import { deleteCategory, moveCategory, saveCategory, toggleCategory } from "@/app/admin/actions";
import { Photo } from "@/components/ui/photo";
import type { Category, Gender } from "@/lib/types";
import { Card } from "./ui";

type Row = Category & { count: number };

function CategoryForm({ category, gender, onDone }: { category?: Category; gender: Gender; onDone?: () => void }) {
  const [state, action, pending] = useActionState(async (prev: Awaited<ReturnType<typeof saveCategory>>, fd: FormData) => {
    const res = await saveCategory(prev, fd);
    if (res?.ok) onDone?.();
    return res;
  }, undefined);
  return (
    <form action={action} className="grid gap-3 md:grid-cols-2">
      <input type="hidden" name="id" value={category?.id ?? ""} />
      <input type="hidden" name="gender" value={gender} />
      {category && <input type="hidden" name="active" value={category.active ? "on" : ""} />}
      <div>
        <label className="label">Name *</label>
        <input name="name" required defaultValue={category?.name} placeholder="e.g. Co-ord Sets" className="field" />
      </div>
      <div>
        <label className="label">Short description</label>
        <input name="description" defaultValue={category?.description} className="field" />
      </div>
      <div>
        <label className="label">Image URL</label>
        <input name="image" defaultValue={category?.image} placeholder="https://…" className="field" />
      </div>
      <div>
        <label className="label">…or upload image</label>
        <input name="upload" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="block w-full text-sm" />
      </div>
      <div className="flex items-center gap-3 md:col-span-2">
        <button type="submit" disabled={pending} className="btn btn-dark !min-h-10">
          {pending ? "Saving…" : category ? "Save" : "Add category"}
        </button>
        {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
        {state?.ok && !category && <p className="text-sm text-emerald-700">{state.ok}</p>}
      </div>
    </form>
  );
}

function CategoryRow({ row, first, last }: { row: Row; first: boolean; last: boolean }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  return (
    <li className={`py-3 ${pending ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-sand">{row.image && <Photo src={row.image} alt="" fill sizes="40px" />}</div>
        <div className="min-w-0 flex-1">
          <p className={`font-medium ${row.active ? "" : "text-stone line-through"}`}>{row.name}</p>
          <p className="text-xs text-stone">
            {row.count} products{row.count === 0 && row.active ? " · hidden on site until stocked" : ""}
          </p>
        </div>
        <div className="flex items-center">
          <button type="button" disabled={first} onClick={() => start(() => moveCategory(row.id, -1))} aria-label="Move up" className="grid h-8 w-8 place-items-center disabled:opacity-20">
            <ChevronUp className="h-4 w-4" />
          </button>
          <button type="button" disabled={last} onClick={() => start(() => moveCategory(row.id, 1))} aria-label="Move down" className="grid h-8 w-8 place-items-center disabled:opacity-20">
            <ChevronDown className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => start(() => toggleCategory(row.id))} aria-label={row.active ? "Hide" : "Show"} title={row.active ? "Hide from website" : "Show on website"} className="grid h-8 w-8 place-items-center">
            {row.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-stone" />}
          </button>
          <button type="button" onClick={() => setEditing((e) => !e)} aria-label="Edit" className="grid h-8 w-8 place-items-center">
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Delete"
            onClick={() => {
              if (!confirm(`Delete category "${row.name}"?`)) return;
              start(async () => {
                const res = await deleteCategory(row.id);
                setError(res?.error ?? "");
              });
            }}
            className="grid h-8 w-8 place-items-center text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      {editing && (
        <div className="mt-3 rounded-sm bg-cream p-4">
          <CategoryForm category={row} gender={row.gender} onDone={() => setEditing(false)} />
        </div>
      )}
    </li>
  );
}

export function CategoryManager({ rows }: { rows: Row[] }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {(["men", "women"] as const).map((g) => {
        const list = rows.filter((r) => r.gender === g).sort((a, b) => a.order - b.order);
        return (
          <Card key={g}>
            <h2 className="font-display text-3xl">{g === "men" ? "Men" : "Women"}</h2>
            <ul className="mt-2 divide-y divide-line">
              {list.map((r, i) => (
                <CategoryRow key={r.id} row={r} first={i === 0} last={i === list.length - 1} />
              ))}
            </ul>
            <details className="mt-4 border-t border-line pt-4">
              <summary className="cursor-pointer text-sm font-medium">+ Add {g === "men" ? "men's" : "women's"} category</summary>
              <div className="mt-4">
                <CategoryForm gender={g} />
              </div>
            </details>
          </Card>
        );
      })}
    </div>
  );
}
