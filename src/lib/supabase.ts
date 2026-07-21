import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Faux tant que le projet Supabase dédié n'est pas branché (.env). */
export const supabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(
  url || "https://non-configure.supabase.co",
  anonKey || "non-configure"
);

export type SpeedOrderStatus = "new" | "preparing" | "delivered" | "cancelled";

export interface SpeedOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface SpeedOrder {
  id: string;
  order_number: number;
  club_id: string;
  club_name: string;
  customer_name: string;
  customer_phone: string;
  comments: string | null;
  items: SpeedOrderItem[];
  total: number;
  status: SpeedOrderStatus;
  created_at: string;
  updated_at: string;
}
