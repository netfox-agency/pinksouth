import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  supabase,
  type SpeedOrder,
  type SpeedOrderStatus,
} from "@/lib/supabase";

const STATUS_LABELS: Record<SpeedOrderStatus, string> = {
  new: "Nouvelle",
  preparing: "En préparation",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const inputClass =
  "w-full appearance-none rounded-md border border-border/60 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none fluid-transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20";

/** Bip discret joué à chaque nouvelle commande (aucun asset audio requis). */
const playChime = () => {
  try {
    const ctx = new AudioContext();
    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + i * 0.18 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.18 + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 0.35);
    });
  } catch {
    // Autoplay bloqué tant que l'écran n'a pas été touché : sans gravité.
  }
};

const todayISO = () => {
  const now = new Date();
  const tz = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tz).toISOString().slice(0, 10);
};

const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const Login = ({ onError }: { onError: (msg: string) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) onError("Identifiants incorrects.");
    setBusy(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="animate-scale-in w-full max-w-sm rounded-lg border border-border/50 bg-gradient-surface p-8"
      >
        <img
          src="/images/logo.png"
          alt="Pink South"
          className="mx-auto mb-2 h-14 w-auto"
        />
        <h1 className="mb-6 text-center text-xl font-bold text-foreground">
          Espace équipe
        </h1>
        <label className="mb-4 block">
          <span className="mb-1.5 block text-sm font-semibold">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            placeholder="equipe@pinksouth.fr"
            className={inputClass}
            required
          />
        </label>
        <label className="mb-6 block">
          <span className="mb-1.5 block text-sm font-semibold">
            Mot de passe
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
            className={inputClass}
            required
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="h-11 w-full rounded-md bg-gradient-neon font-semibold text-primary-foreground fluid-transition hover:glow-neon disabled:opacity-60"
        >
          {busy ? "Connexion…" : "Se connecter"}
        </button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Accès réservé à l'équipe Pink South.
        </p>
      </form>
    </div>
  );
};

const OrderCard = ({
  order,
  onStatus,
}: {
  order: SpeedOrder;
  onStatus: (id: string, status: SpeedOrderStatus) => void;
}) => {
  const actionButton =
    "h-10 flex-1 rounded-md text-sm font-semibold fluid-transition";

  return (
    <article
      className={`rounded-lg border bg-gradient-surface p-4 ${
        order.status === "new"
          ? "border-accent/60 glow-pink"
          : "border-border/50"
      }`}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-foreground">
            #{order.order_number}{" "}
            <span className="font-semibold text-accent">
              {order.customer_name}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            {timeOf(order.created_at)} · {order.club_name}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
            order.status === "new"
              ? "bg-accent text-accent-foreground"
              : order.status === "preparing"
                ? "bg-secondary/20 text-secondary"
                : order.status === "delivered"
                  ? "bg-muted text-muted-foreground"
                  : "bg-destructive/15 text-destructive"
          }`}
        >
          {STATUS_LABELS[order.status]}
        </span>
      </header>

      <ul className="mb-3 space-y-1 text-sm">
        {order.items.map((item, i) => (
          <li key={i} className="flex justify-between gap-3">
            <span>
              <span className="font-bold text-foreground">
                {item.quantity}×
              </span>{" "}
              {item.name}
            </span>
            <span className="text-muted-foreground">
              {(item.price * item.quantity).toFixed(0)}€
            </span>
          </li>
        ))}
      </ul>

      {order.comments && (
        <p className="mb-3 rounded-md border border-border/40 bg-background/40 p-2.5 text-sm text-muted-foreground">
          💬 {order.comments}
        </p>
      )}

      <div className="mb-3 flex items-center justify-between border-t border-border/40 pt-3">
        <a
          href={`tel:${order.customer_phone.replace(/[^0-9+]/g, "")}`}
          className="flex items-center gap-2 rounded-md border border-secondary/50 px-3 py-2 text-sm font-semibold text-secondary fluid-transition hover:bg-secondary/10"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          {order.customer_phone}
        </a>
        <p className="text-lg font-bold text-accent">
          {Number(order.total).toFixed(2)}€
        </p>
      </div>

      {order.status === "new" && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onStatus(order.id, "preparing")}
            className={`${actionButton} bg-gradient-neon text-primary-foreground hover:glow-neon`}
          >
            En préparation
          </button>
          <button
            type="button"
            onClick={() => onStatus(order.id, "cancelled")}
            className={`${actionButton} max-w-28 border border-destructive/50 text-destructive hover:bg-destructive/10`}
          >
            Annuler
          </button>
        </div>
      )}
      {order.status === "preparing" && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onStatus(order.id, "delivered")}
            className={`${actionButton} bg-gradient-accent text-primary-foreground hover:glow-pink`}
          >
            ✓ Livrée
          </button>
          <button
            type="button"
            onClick={() => onStatus(order.id, "cancelled")}
            className={`${actionButton} max-w-28 border border-destructive/50 text-destructive hover:bg-destructive/10`}
          >
            Annuler
          </button>
        </div>
      )}
    </article>
  );
};

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [orders, setOrders] = useState<SpeedOrder[]>([]);
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState<string | null>(null);
  const ordersRef = useRef(orders);
  ordersRef.current = orders;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoaded(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadOrders = useCallback(async () => {
    const start = `${date}T00:00:00`;
    const end = `${date}T23:59:59`;
    const { data, error: err } = await supabase
      .from("speed_orders")
      .select("*")
      .gte("created_at", new Date(start).toISOString())
      .lte("created_at", new Date(end).toISOString())
      .order("created_at", { ascending: false });
    if (err) {
      setError("Lecture des commandes impossible. Reconnectez-vous.");
      return;
    }
    setError(null);
    setOrders((data as SpeedOrder[]) || []);
  }, [date]);

  useEffect(() => {
    if (!session) return;
    loadOrders();

    const channel = supabase
      .channel("speed-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "speed_orders" },
        (payload) => {
          const order = payload.new as SpeedOrder;
          if (order.created_at.slice(0, 10) === todayISO()) {
            setOrders((prev) =>
              prev.some((o) => o.id === order.id) ? prev : [order, ...prev]
            );
            playChime();
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "speed_orders" },
        (payload) => {
          const order = payload.new as SpeedOrder;
          setOrders((prev) =>
            prev.map((o) => (o.id === order.id ? order : o))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, loadOrders]);

  const newCount = orders.filter((o) => o.status === "new").length;

  useEffect(() => {
    document.title =
      newCount > 0
        ? `(${newCount}) Commandes — Pink South`
        : "Commandes — Pink South";
    return () => {
      document.title = "Pink South - Burgers gourmets en boîte de nuit";
    };
  }, [newCount]);

  const setStatus = async (id: string, status: SpeedOrderStatus) => {
    const previous = ordersRef.current;
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    const { error: err } = await supabase
      .from("speed_orders")
      .update({ status })
      .eq("id", id);
    if (err) setOrders(previous);
  };

  const exportCSV = () => {
    const header = [
      "numero",
      "date",
      "heure",
      "club",
      "prenom",
      "telephone",
      "articles",
      "total_eur",
      "statut",
      "commentaires",
    ];
    const rows = orders.map((o) => [
      o.order_number,
      o.created_at.slice(0, 10),
      timeOf(o.created_at),
      o.club_name,
      o.customer_name,
      o.customer_phone,
      o.items.map((i) => `${i.quantity}x ${i.name}`).join(" | "),
      Number(o.total).toFixed(2),
      STATUS_LABELS[o.status],
      o.comments ?? "",
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";")
      )
      .join("\n");
    const blob = new Blob([`﻿${csv}`], {
      type: "text/csv;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `commandes-speed-${date}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const sections = useMemo(
    () =>
      (
        [
          ["new", "Nouvelles"],
          ["preparing", "En préparation"],
          ["delivered", "Livrées"],
          ["cancelled", "Annulées"],
        ] as [SpeedOrderStatus, string][]
      ).map(([status, label]) => ({
        status,
        label,
        list: orders.filter((o) => o.status === status),
      })),
    [orders]
  );

  const dayTotal = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + Number(o.total), 0);

  if (!sessionLoaded) return <div className="min-h-screen" />;

  if (!session) {
    return (
      <>
        {error && (
          <p className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-md bg-destructive/15 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <Login onError={setError} />
      </>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-40 border-b border-border/30 bg-background/85 backdrop-blur-sm">
        <div className="container mx-auto flex flex-wrap items-center gap-3 px-4 py-3">
          <img
            src="/images/logo.png"
            alt="Pink South"
            className="h-9 w-auto"
          />
          <h1 className="text-lg font-bold text-foreground">Commandes</h1>
          {newCount > 0 && (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-accent-foreground">
              {newCount}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Filtrer par date"
              className="h-9 appearance-none rounded-md border border-border/60 bg-background px-2.5 text-sm text-foreground outline-none focus:border-accent/60"
            />
            <button
              type="button"
              onClick={exportCSV}
              className="h-9 rounded-md border border-border/60 px-3 text-sm font-medium text-foreground fluid-transition hover:bg-muted"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="h-9 rounded-md border border-border/60 px-3 text-sm font-medium text-muted-foreground fluid-transition hover:bg-muted hover:text-foreground"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-6">
        {error && (
          <p className="mb-6 rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <p>
            <span className="font-bold text-foreground">{orders.length}</span>{" "}
            commande{orders.length > 1 ? "s" : ""} le {date}
          </p>
          <p>
            CA livré :{" "}
            <span className="font-bold text-accent">
              {dayTotal.toFixed(2)}€
            </span>
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-border/50 bg-gradient-surface p-10 text-center text-muted-foreground">
            Aucune commande pour cette date. Les nouvelles commandes
            apparaîtront ici en temps réel.
          </div>
        ) : (
          <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-4">
            {sections.map(({ status, label, list }) => (
              <section key={status}>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  {label} ({list.length})
                </h2>
                <div className="space-y-4">
                  {list.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatus={setStatus}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
