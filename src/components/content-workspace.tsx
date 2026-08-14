"use client";

import { useEffect, useState } from "react";
import { DEFAULT_MARKETING_CONTENT, type MarketingContentKey, type MarketingHeroContent } from "@/lib/marketing-content";

const pages: Array<{ key: MarketingContentKey; label: string }> = [
  { key: "home.hero", label: "Strona główna" }, { key: "offer.hero", label: "Oferta" }, { key: "templates.hero", label: "Szablony" }, { key: "pricing.hero", label: "Cennik" }, { key: "contact.hero", label: "Kontakt" },
];

export function ContentWorkspace() {
  const [selectedKey, setSelectedKey] = useState<MarketingContentKey>("home.hero");
  const [content, setContent] = useState<MarketingHeroContent>(DEFAULT_MARKETING_CONTENT["home.hero"]);
  const [status, setStatus] = useState("Łączenie z WordPressem…");
  const [busy, setBusy] = useState(true);

  async function loadContent(key: MarketingContentKey) {
    setBusy(true); setStatus("Pobieranie wersji roboczej…");
    try {
      const response = await fetch(`/api/content/marketing?key=${encodeURIComponent(key)}&status=draft`, { cache: "no-store" });
      const data = await response.json() as { content?: Partial<MarketingHeroContent>; error?: string };
      setContent({ ...DEFAULT_MARKETING_CONTENT[key], ...(data.content ?? {}) });
      setStatus(response.ok ? "Połączono z WordPressem" : `Brak połączenia: ${data.error ?? "sprawdź konfigurację"}`);
    } catch { setContent(DEFAULT_MARKETING_CONTENT[key]); setStatus("WordPress jest chwilowo niedostępny"); }
    finally { setBusy(false); }
  }

  useEffect(() => {
    let active = true;
    fetch("/api/content/marketing?key=home.hero&status=draft", { cache: "no-store" })
      .then(async (response) => ({ response, data: await response.json() as { content?: Partial<MarketingHeroContent>; error?: string } }))
      .then(({ response, data }) => {
        if (!active) return;
        setContent({ ...DEFAULT_MARKETING_CONTENT["home.hero"], ...(data.content ?? {}) });
        setStatus(response.ok ? "Połączono z WordPressem" : `Brak połączenia: ${data.error ?? "sprawdź konfigurację"}`);
      })
      .catch(() => { if (active) setStatus("WordPress jest chwilowo niedostępny"); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, []);

  function choosePage(key: MarketingContentKey) { setSelectedKey(key); void loadContent(key); }
  function update(field: keyof MarketingHeroContent, value: string) { setContent((current) => ({ ...current, [field]: value })); setStatus("Niezapisane zmiany"); }

  async function saveDraft(showStatus = true) {
    setBusy(true); if (showStatus) setStatus("Zapisywanie wersji roboczej…");
    try {
      const response = await fetch("/api/content/marketing", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: selectedKey, content }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Nie udało się zapisać.");
      if (showStatus) setStatus("Wersja robocza zapisana w WordPressie");
      return true;
    } catch (error) { setStatus(error instanceof Error ? `Błąd: ${error.message}` : "Błąd zapisu"); return false; }
    finally { setBusy(false); }
  }

  async function publish() {
    setStatus("Zapisywanie i publikowanie…");
    if (!(await saveDraft(false))) return;
    setBusy(true);
    try {
      const response = await fetch("/api/content/marketing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: selectedKey }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Nie udało się opublikować.");
      setStatus("Opublikowano — strona została odświeżona");
    } catch (error) { setStatus(error instanceof Error ? `Błąd: ${error.message}` : "Błąd publikacji"); }
    finally { setBusy(false); }
  }

  const isHome = selectedKey === "home.hero";
  return (
    <div className="content-workspace">
      <aside className="content-tree"><span>STRONA PUBLICZNA</span>
        {pages.map((page) => <button key={page.key} className={selectedKey === page.key ? "active" : ""} onClick={() => choosePage(page.key)} disabled={busy}>{page.label}<b>{Object.keys(DEFAULT_MARKETING_CONTENT[page.key]).length}</b></button>)}
        <div className="source-state"><i className={status.startsWith("Połączono") || status.startsWith("Opublikowano") ? "connected" : ""} /><strong>Źródło: WordPress</strong><p>webly.skillup-szkolenia.pl</p></div>
      </aside>
      <section className="content-editor">
        <header><div><span>TREŚCI / {pages.find((page) => page.key === selectedKey)?.label.toUpperCase()}</span><h1>Sekcja otwierająca</h1></div><div><small>{status}</small><button className="draft-button" onClick={() => void saveDraft()} disabled={busy}>ZAPISZ ROBOCZĄ</button><button className="publish-button" onClick={() => void publish()} disabled={busy}>OPUBLIKUJ</button></div></header>
        <div className="editor-grid"><form onSubmit={(event) => event.preventDefault()}>
          <label><span>Etykieta sekcji</span><input value={content.eyebrow} onChange={(event) => update("eyebrow", event.target.value)} /></label>
          <label className="full-field"><span>Główna część nagłówka</span><textarea rows={2} value={content.title} onChange={(event) => update("title", event.target.value)} /><small>{content.title.length} / 70 znaków</small></label>
          <label><span>Wyróżniony fragment</span><input value={content.accent} onChange={(event) => update("accent", event.target.value)} /></label>
          {isHome && <><label><span>Tekst po wyróżnieniu</span><input value={content.tail ?? ""} onChange={(event) => update("tail", event.target.value)} /></label><label><span>Ostatni wiersz</span><input value={content.lastLine ?? ""} onChange={(event) => update("lastLine", event.target.value)} /></label></>}
          <label className="full-field"><span>Tekst wprowadzający</span><textarea rows={4} value={content.lead} onChange={(event) => update("lead", event.target.value)} /><small>{content.lead.length} / 220 znaków</small></label>
          {isHome && <><label><span>Tekst głównego przycisku</span><input value={content.primaryLabel ?? ""} onChange={(event) => update("primaryLabel", event.target.value)} /></label><label><span>Adres głównego przycisku</span><input value={content.primaryHref ?? ""} onChange={(event) => update("primaryHref", event.target.value)} /></label><label><span>Tekst drugiego przycisku</span><input value={content.secondaryLabel ?? ""} onChange={(event) => update("secondaryLabel", event.target.value)} /></label><label><span>Adres drugiego przycisku</span><input value={content.secondaryHref ?? ""} onChange={(event) => update("secondaryHref", event.target.value)} /></label></>}
        </form><div className="live-preview"><div className="preview-bar"><span>PODGLĄD / DESKTOP</span><i>webly.pl</i></div><div className="preview-body"><small>{content.eyebrow}</small><h2>{content.title}<em>{content.accent}</em>{isHome && <>{content.tail}<br />{content.lastLine}</>}</h2><p>{content.lead}</p><button>{content.primaryLabel ?? "Zobacz więcej"} ↗</button></div></div></div>
      </section>
    </div>
  );
}
