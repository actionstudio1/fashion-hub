import Image, { type ImageProps } from "next/image";

/** next/image wrapper used for every product and editorial photo. */
export function Photo({ src, alt, className, ...rest }: Omit<ImageProps, "src"> & { src: string }) {
  // Hosts configured in next.config.ts go through the optimizer; anything else is served as-is.
  const optimizable = src.startsWith("https://images.unsplash.com/") || src.startsWith("https://firebasestorage.googleapis.com/");
  return (
    <Image
      src={src}
      alt={alt}
      unoptimized={!optimizable}
      className={`object-cover ${className ?? ""}`}
      {...rest}
    />
  );
}
