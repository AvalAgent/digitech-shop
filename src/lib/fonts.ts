import { Vazirmatn } from "next/font/google";

// Self-hosted at build time by next/font — no runtime requests to Google.
export const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-sans",
});
