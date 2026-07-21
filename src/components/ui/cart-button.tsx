import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/cart-context";

export const CartButton = () => {
  const navigate = useNavigate();
  const { count } = useCart();

  if (count === 0) return null;

  return (
    <button
      type="button"
      onClick={() => navigate("/cart")}
      aria-label={`Voir le panier (${count} article${count > 1 ? "s" : ""})`}
      className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground transition-all duration-300 hover:glow-pink"
    >
      <div className="relative">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-background px-1 text-[11px] font-bold text-foreground">
          {count}
        </span>
      </div>
    </button>
  );
};
