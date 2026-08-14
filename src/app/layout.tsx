import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Webly — panel platformy",
  description: "Panel zarządzania stronami i sklepami w abonamencie",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}

