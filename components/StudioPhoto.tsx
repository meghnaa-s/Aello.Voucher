import clsx from "clsx";

/**
 * Default studio image is a hand-built editorial illustration in the Aello
 * palette (arched studio window + reformer silhouette) so the site never
 * ships generic stock photography. Pass `src` to swap in a real photograph
 * from the admin/CMS settings without touching this component.
 */
export default function StudioPhoto({
  src,
  className,
  caption = "Al Ansab Studio, Muscat",
}: {
  src?: string | null;
  className?: string;
  caption?: string;
}) {
  return (
    <figure
      className={clsx(
        "relative mx-auto w-full max-w-xs select-none",
        className
      )}
    >
      <div className="relative rotate-[-0.6deg] rounded-[2px] bg-paper p-2.5 shadow-[0_18px_40px_-14px_rgba(44,33,24,0.35)]">
        <div className="relative overflow-hidden rounded-[1px] border border-espresso/10">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt="Aello Pilates studio"
              className="aspect-[4/5] w-full object-cover"
            />
          ) : (
            <DefaultStudioArt />
          )}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-espresso/10" />
        </div>
        <figcaption className="pt-3 pb-1 text-center font-sans text-[0.6rem] tracking-luxe-sm uppercase text-umber">
          {caption}
        </figcaption>
      </div>
    </figure>
  );
}

function DefaultStudioArt() {
  return (
    <svg
      viewBox="0 0 400 500"
      className="aspect-[4/5] w-full"
      role="img"
      aria-label="Illustration of the Aello Pilates studio: an arched window with soft light and a reformer silhouette"
    >
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#efe5db" />
          <stop offset="100%" stopColor="#e2d1bd" />
        </linearGradient>
        <linearGradient id="light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbf7f1" />
          <stop offset="100%" stopColor="#dfccba" />
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9b39a" />
          <stop offset="100%" stopColor="#b99e83" />
        </linearGradient>
      </defs>

      <rect width="400" height="500" fill="url(#wall)" />
      <rect y="360" width="400" height="140" fill="url(#floor)" opacity="0.55" />

      <path
        d="M120 360 V190 C120 130 155 90 200 90 C245 90 280 130 280 190 V360 Z"
        fill="url(#light)"
        opacity="0.9"
      />
      <path
        d="M120 360 V190 C120 130 155 90 200 90 C245 90 280 130 280 190 V360"
        fill="none"
        stroke="#8a6f56"
        strokeOpacity="0.35"
        strokeWidth="2"
      />

      <g opacity="0.5">
        <line x1="60" y1="0" x2="60" y2="500" stroke="#8a6f56" strokeOpacity="0.15" />
        <line x1="340" y1="0" x2="340" y2="500" stroke="#8a6f56" strokeOpacity="0.15" />
      </g>

      <g transform="translate(200 330)">
        <rect x="-95" y="18" width="190" height="10" rx="5" fill="#5a4636" opacity="0.8" />
        <rect x="-88" y="6" width="24" height="18" rx="3" fill="#5a4636" opacity="0.75" />
        <rect x="64" y="6" width="24" height="18" rx="3" fill="#5a4636" opacity="0.75" />
        <line x1="-95" y1="10" x2="-115" y2="10" stroke="#5a4636" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <line x1="95" y1="10" x2="115" y2="10" stroke="#5a4636" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <rect x="-14" y="-2" width="28" height="10" rx="2" fill="#7a5238" opacity="0.55" />
      </g>

      <circle cx="205" cy="150" r="34" fill="#fbf7f1" opacity="0.6" />
    </svg>
  );
}
