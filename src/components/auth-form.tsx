"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function AuthForm({ mode, templateId }: { mode: "login" | "register"; templateId?: string }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const payload = Object.fromEntries(data.entries());

    try {
      const response = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Operacja nie powiodła się.");
      window.location.href = mode === "register" && templateId
        ? `/konto/witryny/nowa?template=${encodeURIComponent(templateId)}`
        : "/konto";
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Spróbuj ponownie.");
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {mode === "register" && <label>Jak mamy się do Ciebie zwracać?<input name="name" autoComplete="name" minLength={2} required placeholder="Anna / Studio Północ" /></label>}
      <label>Adres e-mail<input name="email" type="email" autoComplete="email" required placeholder="ty@firma.pl" /></label>
      <label>Hasło<input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "register" ? 8 : 1} required placeholder={mode === "register" ? "Minimum 8 znaków" : "Twoje hasło"} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="auth-submit" disabled={busy}>{busy ? "CHWILA…" : mode === "login" ? "ZALOGUJ SIĘ →" : "UTWÓRZ KONTO →"}</button>
      <p className="auth-switch">{mode === "login" ? <>Nie masz konta? <Link href="/rejestracja">Załóż je bezpłatnie</Link></> : <>Masz już konto? <Link href="/logowanie">Zaloguj się</Link></>}</p>
    </form>
  );
}

