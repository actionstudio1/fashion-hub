import Link from "next/link";
import { Photo } from "@/components/ui/photo";

export type CategoryCard = { title: string; description: string; href: string; image: string; position?: string };

function Card({ card, className, sizes }: { card: CategoryCard; className: string; sizes: string }) {
  return (
    <Link href={card.href} className={`group relative block overflow-hidden bg-sand text-white ${className}`}>
      <Photo
        src={card.image}
        alt={card.title}
        fill
        sizes={sizes}
        style={{ objectPosition: card.position ?? "center" }}
        className="transition duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
        <h3 className="font-display text-4xl leading-none md:text-5xl">{card.title}</h3>
        <p className="mt-2 max-w-xs text-sm text-white/85">{card.description}</p>
        <span className="mt-5 inline-flex items-center gap-2 border-b border-white/70 pb-1 text-[0.7rem] uppercase tracking-[0.22em] transition group-hover:gap-4">
          Shop now <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

export function CategoryCards({ cards }: { cards: CategoryCard[] }) {
  const [men, women, ...rest] = cards;
  return (
    <div className="grid gap-3 md:gap-5">
      <div className="grid gap-3 md:grid-cols-2 md:gap-5">
        <Card card={men} className="aspect-[4/5] md:aspect-[5/6]" sizes="(min-width: 768px) 50vw, 100vw" />
        <Card card={women} className="aspect-[4/5] md:aspect-[5/6]" sizes="(min-width: 768px) 50vw, 100vw" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {rest.map((c, i) => (
          <Card
            key={c.href}
            card={c}
            className={`aspect-[3/4] md:aspect-[4/5] ${i === rest.length - 1 && rest.length % 2 === 1 ? "col-span-2 !aspect-[16/10] md:col-span-1 md:!aspect-[4/5]" : ""}`}
            sizes="(min-width: 768px) 33vw, 50vw"
          />
        ))}
      </div>
    </div>
  );
}
