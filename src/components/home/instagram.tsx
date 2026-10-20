import { InstagramIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/photo";
import { SITE } from "@/lib/site";

export function InstagramSection({ images }: { images: string[] }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <p className="eyebrow text-gold">As seen on Instagram</p>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] md:text-6xl">
            Join the <em>Fashion Hub</em> family
          </h2>
          <p className="mt-4 text-stone">
            7,500+ followers. 800+ looks. Spotted something on our feed? Find it here — or DM us and we&apos;ll set it aside for you.
          </p>
          <div className="mt-6 flex items-center justify-center gap-8 text-center">
            <div>
              <p className="font-display text-4xl">800+</p>
              <p className="eyebrow mt-1 text-stone">Posts</p>
            </div>
            <span className="h-10 w-px bg-line" />
            <div>
              <p className="font-display text-4xl">7.5K+</p>
              <p className="eyebrow mt-1 text-stone">Followers</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 md:grid-cols-6">
        {images.slice(0, 6).map((src, i) => (
          <a key={src} href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Fashion Hub on Instagram, post ${i + 1}`} className="group relative aspect-square overflow-hidden bg-sand">
            <Photo src={src} alt="" fill sizes="(min-width: 768px) 17vw, 33vw" className="transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 grid place-items-center bg-ink/0 text-white opacity-0 transition group-hover:bg-ink/40 group-hover:opacity-100">
              <InstagramIcon className="h-7 w-7" />
            </span>
          </a>
        ))}
      </div>
      <div className="mt-10 text-center">
        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
          <InstagramIcon className="h-4 w-4" /> Follow {SITE.instagramHandle}
        </a>
      </div>
    </section>
  );
}
