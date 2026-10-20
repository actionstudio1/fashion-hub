import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OfferForm } from "@/components/admin/offer-form";
import { readDbAsAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Edit offer" };

export default async function EditOfferPage(props: PageProps<"/admin/offers/[id]">) {
  const { id } = await props.params;
  const offer = (await readDbAsAdmin({ orders: false })).offers.find((o) => o.id === id);
  if (!offer) notFound();
  return <OfferForm key={offer.id} offer={offer} />;
}
