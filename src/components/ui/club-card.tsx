interface ClubCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  onSelect: (clubId: string) => void;
}

export const ClubCard = ({
  id,
  name,
  description,
  image,
  onSelect,
}: ClubCardProps) => {
  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-lg border border-border/50 bg-gradient-surface text-card-foreground shadow-sm fluid-transition hover:border-accent/50 hover:glow-neon"
      onClick={() => onSelect(id)}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover fluid-transition group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent fluid-transition group-hover:from-background/60" />
        <div className="absolute bottom-4 left-4 right-4 fluid-transition">
          <h3 className="mb-1 text-xl font-bold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground fluid-transition group-hover:text-foreground/90">
            {description}
          </p>
        </div>
      </div>

      <div className="p-6">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(id);
          }}
          className="h-10 w-full rounded-md bg-gradient-neon px-4 py-2 text-sm font-semibold text-primary-foreground fluid-transition hover:glow-neon"
        >
          Choisir cette boîte
        </button>
      </div>
    </div>
  );
};
