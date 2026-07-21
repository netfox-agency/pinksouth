/** Palmes décoratives du flyer, en silhouette discrète dans les coins. */
export const PalmDecor = () => {
  const frond = (
    <>
      <path d="M100 100 Q92 55 60 28" />
      <path d="M100 100 Q70 60 30 52" />
      <path d="M100 100 Q60 78 22 82" />
      <path d="M100 100 Q95 40 108 12" />
      <path d="M100 100 Q118 48 148 30" />
      <path d="M100 100 Q130 62 168 60" />
      <path d="M100 100 Q138 84 175 96" />
    </>
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden"
    >
      <svg
        viewBox="0 0 200 110"
        className="absolute -left-16 -top-10 h-56 w-56 -rotate-[24deg] text-accent/[0.13]"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      >
        {frond}
      </svg>
      <svg
        viewBox="0 0 200 110"
        className="absolute -right-16 -top-12 h-64 w-64 rotate-[22deg] text-secondary/[0.12]"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      >
        {frond}
      </svg>
    </div>
  );
};
