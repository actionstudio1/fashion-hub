import type { Metadata } from "next";
import { OfferForm } from "@/components/admin/offer-form";

export const metadata: Metadata = { title: "Create offer" };

export default function NewOfferPage() {
  return <OfferForm />;
}
