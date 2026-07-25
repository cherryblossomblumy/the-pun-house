"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  name: string;
  price: string;
  image: string;
  tagline: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  isLoading: boolean;
  showCartNotification: boolean;
  setShowCartNotification: (v: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("pun_session");
  if (!sid) {
    sid = "sess_" + Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem("pun_session", sid);
  }
  return sid;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);

  const fetchCart = useCallback(async () => {
    const sid = getSessionId();
    if (!sid) return;
    try {
      const res = await fetch(`/api/cart?sessionId=${sid}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: number) => {
    setIsLoading(true);
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: getSessionId(), productId }),
      });
      await fetchCart();
      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 2500);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    setIsLoading(true);
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      await fetchCart();
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    setIsLoading(true);
    try {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });
      await fetchCart();
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + parseFloat(i.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        isLoading,
        showCartNotification,
        setShowCartNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
