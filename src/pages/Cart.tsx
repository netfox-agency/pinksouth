import { useState } from "react";
import { Link } from "react-router-dom";
import { BackButton } from "@/components/ui/back-button";
import { HelpButton } from "@/components/ui/help-button";
import { SiteFooter } from "@/components/ui/site-footer";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { getClub } from "@/data/clubs";
import { orderingEnabled, submitOrder } from "@/lib/orders";

const inputClass =
  "w-full appearance-none rounded-md border border-border/60 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none fluid-transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20";

const Cart = () => {
  const { items, updateQuantity, removeItem, clear, total } = useCart();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [comments, setComments] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);

  const club = items.length ? getClub(items[0].clubId) : undefined;

  const stepperButton =
    "flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground fluid-transition hover:bg-accent hover:text-accent-foreground";

  const phoneValid = /^[0-9+ .()-]{6,20}$/.test(phone.trim());

  const handleSubmit = async () => {
    if (!firstName.trim()) {
      toast("Merci d'indiquer votre prénom.");
      return;
    }
    if (!phoneValid) {
      toast("Merci d'indiquer un numéro de téléphone valide.");
      return;
    }
    if (!club) return;
    if (!orderingEnabled) {
      toast("L'envoi de commandes sera bientôt disponible.");
      return;
    }

    setSending(true);
    try {
      const { ref } = await submitOrder({
        clubId: club.id,
        clubName: club.name,
        customerName: firstName,
        customerPhone: phone,
        comments,
        items,
      });
      setConfirmedRef(ref);
      clear();
    } catch {
      toast("Impossible d'envoyer la commande. Réessayez dans un instant.");
    } finally {
      setSending(false);
    }
  };

  if (confirmedRef !== null) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto flex min-h-[80vh] max-w-lg flex-col items-center justify-center px-4 text-center">
          <div className="animate-scale-in w-full rounded-lg border border-border/50 bg-gradient-surface p-8 md:p-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-neon">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="hsl(var(--primary-foreground))"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h1 className="font-display text-2xl text-foreground md:text-3xl">
              Commande {confirmedRef} envoyée !
            </h1>
            <p className="mt-4 text-muted-foreground">
              Notre équipe la prépare et vous livre directement à l'entrée.
              Gardez votre téléphone à portée de main, nous vous appellerons si
              besoin.
            </p>
            <Link
              to="/"
              className="mt-8 inline-block rounded-md bg-gradient-neon px-6 py-3 text-sm font-semibold text-primary-foreground fluid-transition hover:glow-neon"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
        <HelpButton />
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 pb-16 pt-6 md:px-6 md:pt-10">
        <div className="mb-8 flex items-center gap-5">
          <BackButton />
          <h1 className="font-display text-3xl text-foreground md:text-4xl">
            Mon Panier
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="animate-fade-in rounded-lg border border-border/50 bg-gradient-surface p-10 text-center">
            <p className="text-muted-foreground">Votre panier est vide.</p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-md bg-gradient-neon px-6 py-3 text-sm font-semibold text-primary-foreground fluid-transition hover:glow-neon"
            >
              Choisir une boîte de nuit
            </Link>
          </div>
        ) : (
          <div className="grid animate-fade-in gap-6 lg:grid-cols-[1fr,360px]">
            <div className="space-y-4 self-start">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-lg border border-border/50 bg-gradient-surface p-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold text-foreground">
                      {item.name}
                    </p>
                    <p className="font-semibold text-accent">{item.price}€</p>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="Diminuer la quantité"
                        className={stepperButton}
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Augmenter la quantité"
                        className={stepperButton}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Retirer ${item.name} du panier`}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-destructive fluid-transition hover:bg-destructive/10"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <aside className="self-start rounded-lg border border-border/50 bg-gradient-surface p-6">
              <h2 className="mb-5 text-xl font-bold text-foreground">
                Récapitulatif
              </h2>

              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Articles ({items.reduce((sum, i) => sum + i.quantity, 0)})
                </span>
                <span className="font-semibold">{total.toFixed(2)}€</span>
              </div>

              <div className="mb-5 space-y-1 rounded-md border border-border/50 bg-background/40 p-4 text-sm">
                <p className="text-muted-foreground">
                  Enseigne :{" "}
                  <span className="font-semibold text-foreground">
                    Pink South
                  </span>
                </p>
                <p className="text-muted-foreground">
                  Adresse :{" "}
                  <span className="font-semibold text-foreground">
                    {club?.name}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  Mode :{" "}
                  <span className="font-semibold text-foreground">
                    Livraison
                  </span>
                </p>
              </div>

              <label className="mb-4 block">
                <span className="mb-1.5 block text-sm font-semibold">
                  Prénom
                </span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Votre prénom"
                  autoComplete="given-name"
                  maxLength={80}
                  className={inputClass}
                />
              </label>

              <label className="mb-1.5 block">
                <span className="mb-1.5 block text-sm font-semibold">
                  Numéro de téléphone
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                  maxLength={20}
                  className={inputClass}
                />
              </label>
              <p className="mb-4 text-xs text-muted-foreground">
                Nous vous contacterons si besoin.
              </p>

              <label className="mb-6 block">
                <span className="mb-1.5 block text-sm font-semibold">
                  Commentaires
                </span>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Allergies, consignes de livraison, etc. (optionnel)"
                  rows={3}
                  maxLength={500}
                  className={`${inputClass} resize-y`}
                />
              </label>

              <div className="mb-1 flex items-center justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold text-accent">
                  {total.toFixed(2)}€
                </span>
              </div>
              <p className="mb-5 text-right text-xs text-muted-foreground">
                dont TVA 5,5 % : {(total - total / 1.055).toFixed(2)}€
              </p>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={sending}
                className="h-11 w-full rounded-md bg-gradient-accent font-semibold text-primary-foreground fluid-transition hover:glow-pink disabled:pointer-events-none disabled:opacity-60"
              >
                {sending ? "Envoi en cours…" : "Valider la commande"}
              </button>
              <button
                type="button"
                onClick={clear}
                className="mt-3 h-10 w-full rounded-md border border-border/60 text-sm font-medium text-muted-foreground fluid-transition hover:bg-muted hover:text-foreground"
              >
                Vider le panier
              </button>
              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground/70">
                Paiement à la livraison. Vos prénom et numéro servent uniquement
                à préparer et livrer votre commande ; ils ne sont ni partagés ni
                utilisés à des fins commerciales.
              </p>
            </aside>
          </div>
        )}
      </div>

      <HelpButton />

      <SiteFooter />
    </div>
  );
};

export default Cart;
