import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center md:py-36">
      <p className="eyebrow text-gold">Error 404</p>
      <h1 className="mt-4 font-display text-6xl md:text-8xl">Out of stock?</h1>
      <p className="mx-auto mt-4 max-w-md text-stone">We couldn&apos;t find that page. It may have sold out or moved — explore what&apos;s new instead.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/new-arrivals" className="btn btn-dark">New arrivals</Link>
        <Link href="/" className="btn btn-outline">Home</Link>
      </div>
    </div>
  );
}
