import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCustomerSession } from "@/lib/customer-session";

export const metadata: Metadata = { title: "Załóż konto Webly", robots: { index: false, follow: false } };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  if (await getCustomerSession()) redirect("/konto");
  const { template } = await searchParams;
  return <main className="auth-shell"><Link href="/" className="auth-brand"><span>W</span><strong>webly</strong></Link><section className="auth-copy"><span>START / 14 DNI</span><h1>Twoja strona<br />zaczyna się <em>tutaj.</em></h1><p>Załóż konto bez karty. Wybierz szablon, zmień treści i zobacz efekt przed publikacją.</p><ul><li>6 gotowych kierunków</li><li>Edytor sekcji bez kodowania</li><li>Wersja robocza i publikacja</li></ul></section><section className="auth-card"><span>NOWE KONTO</span><h2>Zajmie mniej niż minutę.</h2><AuthForm mode="register" templateId={template} /></section></main>;
}
