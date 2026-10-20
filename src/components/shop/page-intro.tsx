import Link from "next/link";

export function PageIntro({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="container-x pb-10 pt-10 text-center md:pb-14 md:pt-16">
      <nav aria-label="Breadcrumb" className="eyebrow text-stone">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        / {title}
      </nav>
      <p className="eyebrow mt-8 text-gold">{eyebrow}</p>
      <h1 className="mt-3 font-display text-5xl leading-[0.95] animate-fade-up md:text-8xl">{title}</h1>
      {subtitle && <p className="mx-auto mt-5 max-w-xl text-stone animate-fade-up [animation-delay:120ms]">{subtitle}</p>}
    </section>
  );
}
