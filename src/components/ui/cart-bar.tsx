import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/cart-context";

/** La barre est visible dès qu'il y a des articles, sauf sur le panier/admin. */
export const useCartBarVisible = () => {
  const { count } = useCart();
  const { pathname } = useLocation();
  return (
    count > 0 && !pathname.startsWith("/cart") && !pathname.startsWith("/admin")
  );
};

/**
 * Barre de commande façon app de livraison : le chemin vers le panier est
 * évident même pour un client distrait en soirée.
 */
export const CartBar = () => {
  const navigate = useNavigate();
  const { count, total } = useCart();
  const visible = useCartBarVisible();
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const t = window.setTimeout(() => setBump(false), 600);
      prevCount.current = count;
      return () => window.clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-md animate-scale-in">
      <button
        type="button"
        onClick={() => navigate("/cart")}
        aria-label={`Voir mon panier : ${count} article${count > 1 ? "s" : ""}, total ${total.toFixed(2)} euros`}
        className={`flex h-14 w-full items-center justify-between rounded-full bg-gradient-accent px-2.5 pr-6 font-bold uppercase tracking-wide text-primary-foreground shadow-card glow-pink fluid-transition hover:scale-[1.02] ${
          bump ? "animate-cart-bump" : ""
        }`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background/25 text-base font-bold normal-case">
          {count}
        </span>
        <span className="text-sm">Voir mon panier</span>
        <span className="text-sm normal-case">{total.toFixed(0)}€</span>
      </button>
    </div>
  );
};
