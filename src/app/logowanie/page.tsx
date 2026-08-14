import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCustomerSession } from "@/lib/customer-session";

export const metadata: Metadata = { title: "Logowanie do panelu klienta", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getCustomerSession()) redirect("/konto");
  return <main className="auth-shell"><Link href="/" className="auth-brand"><span>W</span><strong>webly</strong></Link><section className="auth-copy"><span>PANEL KLIENTA / 01</span><h1>Wracajmy<br />do Twojej <em>strony.</em></h1><p>Zaloguj się, aby edytować treści, sprawdzić abonament i opublikować zmiany.</p></section><section className="auth-card"><span>LOGOWANIE</span><h2>Dobrze Cię widzieć.</h2><AuthForm mode="login" /></section></main>;
}

