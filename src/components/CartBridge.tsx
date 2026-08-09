"use client";

import { useEffect } from "react";
import { useCart, type ServerCart } from "@/lib/cart";

/**
 * The `window.avalagentCart` contract — how a store lets the AvalAgent sales
 * agent talk to its cart.
 *
 * A store implements two things:
 *   window.avalagentCart.customerPhone  → who is signed in, or null
 *   window.avalagentCart.apply(cart)    → called when the agent changed the cart
 *
 * The cart itself is written server-to-server against this store's own
 * /api/cart, keyed on the customer's phone — nothing here is required for that
 * to work (which is what makes the same flow work on Telegram/Bale, where there
 * is no page at all). This hook is web-only sugar: the agent's result lands
 * straight in the open page so the badge and drawer react instantly.
 */
declare global {
  interface Window {
    avalagentCart?: {
      customerPhone: string | null;
      apply: (cart: ServerCart) => void;
    };
  }
}

export function CartBridge() {
  const { phone, applyServerCart, open } = useCart();

  useEffect(() => {
    window.avalagentCart = {
      customerPhone: phone,
      apply: (cart) => {
        applyServerCart(cart);
        // Open the drawer so the shopper sees what the agent picked.
        open();
      },
    };
    return () => {
      delete window.avalagentCart;
    };
  }, [phone, applyServerCart, open]);

  return null;
}
