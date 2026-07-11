/** Format an IRR/Toman integer as grouped Persian digits, e.g. 24990000 → ۲۴٬۹۹۰٬۰۰۰ */
export function formatToman(irr: number): string {
  return new Intl.NumberFormat("fa-IR", { useGrouping: true }).format(irr);
}
