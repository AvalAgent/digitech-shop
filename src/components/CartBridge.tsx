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
      /**
       * This page's guest cart key. The agent writes with it, so an add lands
       * in the SAME basket this page polls. Without it the agent used its own
       * conversation id, the page kept polling its own key, and the item was
       * wiped by the next refresh a few seconds later.
       */
      cartId: string | null;
      apply: (cart: ServerCart) => void;
    };
  }
}

export function CartBridge() {
  const { phone, guestKey, applyServerCart, open } = useCart();

  useEffect(() => {
    window.avalagentCart = {
      customerPhone: phone,
      cartId: guestKey || null,
      apply: (cart) => {
        applyServerCart(cart);
        // Open the drawer so the shopper sees what the agent picked.
        open();
      },
    };
    return () => {
      delete window.avalagentCart;
    };
  }, [phone, guestKey, applyServerCart, open]);

  return null;
}
