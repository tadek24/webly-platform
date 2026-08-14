import type { Metadata, Viewport } from "next";
import "./styles.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://webly-platform-sigma.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Webly — gotowe strony i sklepy internetowe", template: "%s | Webly" },
  description: "Gotowe strony firmowe, landing page i sklepy internetowe w abonamencie. Projekt, hosting i opieka techniczna w jednym miejscu.",
  keywords: ["strony internetowe w abonamencie", "gotowe strony internetowe", "sklep internetowy", "WooCommerce", "strona firmowa", "landing page"],
  authors: [{ name: "Webly" }],
  creator: "Webly",
  openGraph: { type: "website", locale: "pl_PL", siteName: "Webly" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f1eee6" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pl"><body>{children}</body></html>;
}

