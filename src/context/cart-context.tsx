import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Burger } from "@/data/clubs";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  clubId: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (burger: Burger, quantity: number, clubId: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  count: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "ssf-cart";

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (burger: Burger, quantity: number, clubId: string) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.id === burger.id);
        if (existing) {
          return prev.map((item) =>
            item.id === burger.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [
          ...prev,
          {
            id: burger.id,
            name: burger.name,
            price: burger.price,
            image: burger.image,
            quantity,
            clubId,
          },
        ];
      });
    };

    const updateQuantity = (id: string, quantity: number) => {
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((item) => item.id !== id)
          : prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    };

    const removeItem = (id: string) =>
      setItems((prev) => prev.filter((item) => item.id !== id));

    return {
      items,
      addItem,
      updateQuantity,
      removeItem,
      clear: () => setItems([]),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
