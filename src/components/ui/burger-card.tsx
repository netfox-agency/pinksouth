import { useState } from "react";
import type { Burger } from "@/data/clubs";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";

interface BurgerCardProps {
  burger: Burger;
  clubId: string;
}

export const BurgerCard = ({ burger, clubId }: BurgerCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addItem(burger, quantity, clubId);
    toast(`${quantity}× ${burger.name} ajouté ✔`);
    setQuantity(1);
  };

  const stepperButton =
    "flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-md border border-accent/50 bg-background text-foreground fluid-transition hover:bg-accent hover:text-accent-foreground";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border/50 bg-gradient-surface shadow-sm fluid-transition hover:-translate-y-1 hover:border-accent/50 hover:glow-neon">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={burger.image}
          alt={burger.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className="paper-label paper-label--flip absolute right-2.5 top-2.5 px-3 py-1 font-display text-base">
          {burger.price}€
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3 md:p-4">
        <h3 className="mb-2 text-base font-bold text-foreground md:text-lg">
          {burger.name}
        </h3>
        <p className="mb-4 flex-1 text-xs leading-relaxed text-muted-foreground md:text-sm">
          {burger.description}
        </p>

        <div className="mb-3 flex items-center justify-center gap-2 md:mb-4 md:gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Diminuer la quantité"
            className={stepperButton}
          >
            −
          </button>
          <span className="w-6 text-center text-base font-bold md:text-lg">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            aria-label="Augmenter la quantité"
            className={stepperButton}
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="h-11 w-full rounded-md bg-gradient-accent px-4 text-sm font-bold uppercase tracking-wide text-primary-foreground fluid-transition hover:glow-pink"
        >
          Ajouter ce burger
        </button>
      </div>
    </div>
  );
};
