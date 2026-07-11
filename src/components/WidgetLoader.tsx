"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const WIDGET_SRC = process.env.NEXT_PUBLIC_WIDGET_SRC;
const BUSINESS_ID = process.env.NEXT_PUBLIC_WIDGET_BUSINESS_ID;
const SCRIPT_ID = "avalagent-widget";

/**
 * Injects the AvalAgent chat widget (public/widget.js from avalagent) once, and
 * auto-opens it on the store index ("/"). No-ops when the env vars are unset so
 * the store renders standalone until a demo business id is wired.
 *
 * The widget reads its business id from `document.currentScript` — a dynamically
 * inserted classic script only sets currentScript when async=false, so we force it.
 */
export function WidgetLoader() {
  const pathname = usePathname();

  // Inject the script once.
  useEffect(() => {
    if (!WIDGET_SRC || !BUSINESS_ID) return;
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = WIDGET_SRC;
    script.async = false; // keep document.currentScript valid for the widget
    script.setAttribute("data-business-id", BUSINESS_ID);
    document.body.appendChild(script);
  }, []);

  // Auto-open on the index route only.
  useEffect(() => {
    if (!WIDGET_SRC || !BUSINESS_ID) return;
    if (pathname !== "/") return;

    let tries = 0;
    const timer = setInterval(() => {
      const fab = document.getElementById("smflow-fab");
      if (fab) {
        if (!fab.classList.contains("open")) fab.click();
        clearInterval(timer);
      } else if (++tries > 40) {
        clearInterval(timer); // ~10s: widget never mounted, give up quietly
      }
    }, 250);

    return () => clearInterval(timer);
  }, [pathname]);

  return null;
}
