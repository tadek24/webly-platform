"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { SITE_TEMPLATES } from "@/lib/site-templates";

export function NewSiteWizard({ initialTemplateId }: { initialTemplateId?: string }) {
  const router = useRouter();
  const initial = useMemo(() => SITE_TEMPLATES.some((item) => item.id === initialTemplateId) ? initialTemplateId! : SITE_TEMPLATES[0].id, [initialTemplateId]);
  const [templateId, setTemplateId] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const name = String(new FormData(event.currentTarget).get("name") ?? "");
    try {
      const response = await fetch("/api/sites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, templateId }) });
      const result = await response.json() as { site?: { id: string }; error?: string };
      if (!response.ok || !result.site) throw new Error(result.error ?? "Nie udało się utworzyć witryny.");
      router.push(`/konto/witryny/${result.site.id}/edytor`);
      router.refresh();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Spróbuj ponownie.");
      setBusy(false);
    }
  }

  return <form className="new-site-flow" onSubmit={create}>
    <section className="new-site-name"><span>KROK 01 / NAZWA</span><label>Nazwa projektu<input name="name" required minLength={2} maxLength={80} placeholder="np. Studio Północ" /></label></section>
    <section><div className="account-section-heading"><span>KROK 02 / KIERUNEK</span><h2>Wybierz punkt startu</h2></div><div className="account-template-grid">
      {SITE_TEMPLATES.map((template) => <button type="button" key={template.id} className={`account-template-card theme-${template.theme}${templateId === template.id ? " selected" : ""}`} onClick={() => setTemplateId(template.id)}>
        <small>{template.category}</small><strong>{template.claim}</strong><span>{template.name}</span><i>{templateId === template.id ? "WYBRANO ✓" : "WYBIERZ →"}</i>
      </button>)}
    </div></section>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="new-site-submit"><p>Szablon jest początkiem. Wszystkie sekcje i teksty zmienisz w kolejnym kroku.</p><button disabled={busy}>{busy ? "TWORZĘ…" : "UTWÓRZ I PRZEJDŹ DO EDYTORA →"}</button></div>
  </form>;
}

