import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { CartItem } from "@/context/cart-context";

// Clé publique par conception (exposée dans le bundle de toute façon) :
// fallback en dur pour que le build CI, qui n'a pas le .env, l'embarque aussi.
const WEB3FORMS_KEY =
  (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined) ||
  "3255ded0-dccf-4d15-99b9-70f404c497ad";

/** Au moins un canal de réception est branché (email Web3Forms ou Supabase). */
export const orderingEnabled = supabaseConfigured || Boolean(WEB3FORMS_KEY);

export interface NewOrderInput {
  clubId: string;
  clubName: string;
  customerName: string;
  customerPhone: string;
  comments: string;
  items: CartItem[];
}

/** Référence lisible pour le client et l'équipe (pas de base = pas de séquence). */
const makeRef = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const salt = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `PS-${pad(d.getHours())}${pad(d.getMinutes())}${salt}`;
};

const submitViaSupabase = async (input: NewOrderInput): Promise<string> => {
  const { data, error } = await supabase.rpc("create_speed_order", {
    p_club_id: input.clubId,
    p_club_name: input.clubName,
    p_customer_name: input.customerName.trim(),
    p_customer_phone: input.customerPhone.trim(),
    p_comments: input.comments.trim(),
    p_items: input.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });

  if (error) throw error;
  return `n°${data as number}`;
};

const euro = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;

/** Ticket texte structuré : lisible d'un coup d'œil sur téléphone, la nuit. */
const buildTicket = (input: NewOrderInput, ref: string, total: number) => {
  const now = new Date().toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });

  const lines = input.items.map((item) => {
    const label = `${item.quantity} × ${item.name}`;
    return `${label} ${".".repeat(Math.max(3, 30 - label.length))} ${euro(
      item.price * item.quantity
    )}`;
  });

  return [
    "══════════════════════════════",
    "PINK SOUTH · BON DE COMMANDE",
    "══════════════════════════════",
    "",
    `Référence : ${ref}`,
    `Passée le : ${now}`,
    `Livraison : ${input.clubName} (devant l'entrée)`,
    "",
    "── CLIENT ────────────────────",
    `${input.customerName.trim()}`,
    `${input.customerPhone.trim()}`,
    "",
    "── DÉTAIL ────────────────────",
    ...lines,
    "",
    `TOTAL À ENCAISSER : ${euro(total)}`,
    "Paiement à la livraison",
    ...(input.comments.trim()
      ? ["", "── COMMENTAIRES ──────────────", `« ${input.comments.trim()} »`]
      : []),
    "",
    "══════════════════════════════",
    "pinksouthburger.fr",
  ].join("\n");
};

const submitViaEmail = async (input: NewOrderInput): Promise<string> => {
  const ref = makeRef();
  const total = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // FormData = requête CORS "simple" (pas de preflight, bloqué chez Web3Forms).
  const form = new FormData();
  form.append("access_key", WEB3FORMS_KEY!);
  form.append("from_name", "Pink South");
  form.append(
    "subject",
    `🧾 ${ref} · ${input.clubName} · ${total.toFixed(0)}€ · ${input.customerName.trim()}`
  );
  form.append("botcheck", "");
  form.append("Bon de commande", buildTicket(input, ref, total));

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: form,
  });

  const data = (await response.json()) as { success: boolean };
  if (!response.ok || !data.success) {
    throw new Error("web3forms_failed");
  }
  return ref;
};

/** Envoie la commande et retourne sa référence affichable. */
export const submitOrder = async (
  input: NewOrderInput
): Promise<{ ref: string }> => {
  const ref = supabaseConfigured
    ? await submitViaSupabase(input)
    : await submitViaEmail(input);
  return { ref };
};
