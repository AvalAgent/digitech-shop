"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface CartItem {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  /** e.g. "۲۵۶ گیگابایت · مشکی" */
  variantLabel: string;
  priceIRR: number;
  image?: string;
  qty: number;
}

export interface ServerCart {
  cartId: string;
  customerPhone: string | null;
  items: CartItem[];
  count: number;
  totalIRR: number;
  checkoutUrl?: string;
}

interface CartState {
  items: CartItem[];
  count: number;
  totalIRR: number;
  isOpen: boolean;
  /** Phone of the signed-in shopper, or null while browsing as a guest. */
  phone: string | null;
  /** Anonymous key used until they sign in. */
  guestKey: string;
  loading: boolean;
  /** Bumped when a cart arrives from outside this page (the chat agent). */
  remoteAddSeq: number;
  add: (variantId: string, qty?: number) => Promise<void>;
  setQty: (variantId: string, qty: number) => Promise<void>;
  remove: (variantId: string) => Promise<void>;
  open: () => void;
  close: () => void;
  /** Sign in with a phone; the guest basket merges into that customer's. */
  signIn: (rawPhone: string) => Promise<boolean>;
  signOut: () => void;
  /** Re-read the basket from the server (used by the chat bridge). */
  refresh: () => Promise<void>;
  applyServerCart: (cart: ServerCart) => void;
}

const CartContext = createContext<CartState | null>(null);
const GUEST_KEY = "digitech-cart-id-v1";
const PHONE_KEY = "digitech-phone-v1";

function newGuestKey(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  }
}

/** Same folding the server does — one human is never two customers. */
export function normalizePhone(raw: string): string | null {
  let d = raw.replace(/[۰-۹]/g, (c) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(c))).replace(/\D/g, "");
  if (d.startsWith("0098")) d = d.slice(4);
  else if (d.startsWith("98")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  return /^9\d{9}$/.test(d) ? `0${d}` : null;
}

/**
 * The cart lives on the SERVER now, keyed by the shopper's phone (or a guest key
 * until they sign in). That is what makes the basket the same one the chat agent
 * fills from Telegram — this provider is a view over it, not a second copy.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);
  const [guestKey, setGuestKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [remoteAddSeq, setRemoteAddSeq] = useState(0);
  const hydrated = useRef(false);

  useEffect(() => {
    let key = "";
    let storedPhone: string | null = null;
    try {
      key = localStorage.getItem(GUEST_KEY) || newGuestKey();
      localStorage.setItem(GUEST_KEY, key);
      storedPhone = localStorage.getItem(PHONE_KEY);
    } catch {
      key = newGuestKey();
    }
    setGuestKey(key);
    setPhone(storedPhone);
    hydrated.current = true;
  }, []);

  /** Identity for every call: phone when known, guest key otherwise. */
  const identityQuery = useCallback(() => {
    const p = new URLSearchParams();
    if (phone) p.set("customerPhone", phone);
    if (guestKey) p.set("cartId", guestKey);
    return p.toString();
  }, [phone, guestKey]);

  const identityBody = useCallback(
    () => ({ ...(phone ? { customerPhone: phone } : {}), cartId: guestKey }),
    [phone, guestKey],
  );

  const applyServerCart = useCallback((cart: ServerCart) => {
    setItems(Array.isArray(cart?.items) ? cart.items : []);
  }, []);

  const refresh = useCallback(async () => {
    if (!guestKey) return;
    try {
      const res = await fetch(`/api/cart?${identityQuery()}`);
      const data = res.ok ? await res.json() : null;
      if (data?.cart) applyServerCart(data.cart);
    } catch {
      /* offline — keep what we have */
    } finally {
      setLoading(false);
    }
  }, [guestKey, identityQuery, applyServerCart]);

  // First load, and again whenever the identity changes (sign in / out).
  useEffect(() => {
    if (!hydrated.current || !guestKey) return;
    void refresh();
  }, [guestKey, phone, refresh]);

  // The agent can fill this basket from another channel while the page is open.
  // A light poll keeps the badge honest without any socket plumbing.
  useEffect(() => {
    if (!guestKey) return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 5000);
    return () => clearInterval(timer);
  }, [guestKey, refresh]);

  const mutate = useCallback(
    async (method: "POST" | "PATCH", body: Record<string, unknown>) => {
      try {
        const res = await fetch("/api/cart", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...identityBody(), ...body }),
        });
        const data = res.ok ? await res.json() : null;
        if (data?.cart) applyServerCart(data.cart);
      } catch {
        /* keep the UI as-is; the next refresh reconciles */
      }
    },
    [identityBody, applyServerCart],
  );

  const add = useCallback(
    async (variantId: string, qty = 1) => {
      await mutate("POST", { sku: variantId, variantId, qty });
    },
    [mutate],
  );

  const setQty = useCallback(
    async (variantId: string, qty: number) => {
      await mutate("PATCH", { variantId, qty });
    },
    [mutate],
  );

  const remove = useCallback(
    async (variantId: string) => {
      await mutate("PATCH", { variantId, qty: 0 });
    },
    [mutate],
  );

  const signIn = useCallback(async (rawPhone: string) => {
    const normalized = normalizePhone(rawPhone);
    if (!normalized) return false;
    try {
      localStorage.setItem(PHONE_KEY, normalized);
    } catch {
      /* storage blocked — session-only sign-in still works */
    }
    // Setting the phone re-runs the load effect, and the server merges the
    // guest basket into this customer's on that first identified call.
    setPhone(normalized);
    return true;
  }, []);

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(PHONE_KEY);
    } catch {
      /* ignore */
    }
    setPhone(null);
    setItems([]);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const applyFromAgent = useCallback(
    (cart: ServerCart) => {
      applyServerCart(cart);
      setRemoteAddSeq((n) => n + 1);
    },
    [applyServerCart],
  );

  const value = useMemo<CartState>(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      totalIRR: items.reduce((s, i) => s + i.priceIRR * i.qty, 0),
      isOpen,
      phone,
      guestKey,
      loading,
      remoteAddSeq,
      add,
      setQty,
      remove,
      open,
      close,
      signIn,
      signOut,
      refresh,
      applyServerCart: applyFromAgent,
    }),
    [
      items, isOpen, phone, guestKey, loading, remoteAddSeq,
      add, setQty, remove, open, close, signIn, signOut, refresh, applyFromAgent,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function variantLabel(v: { storage?: string; color?: string }): string {
  return [v.storage, v.color].filter(Boolean).join(" · ") || "استاندارد";
}
