import { supabase } from "@/lib/supabase";
import type { CartItem } from "@/context/cart-context";

export interface NewOrderInput {
  clubId: string;
  clubName: string;
  customerName: string;
  customerPhone: string;
  comments: string;
  items: CartItem[];
}

export const submitOrder = async (
  input: NewOrderInput
): Promise<{ orderNumber: number }> => {
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
  return { orderNumber: data as number };
};
