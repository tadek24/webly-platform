"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DragEvent } from "react";
import { SiteBlockView } from "@/components/site-renderer";
import type { CustomerSite, SiteBlock, SiteBlockType } from "@/lib/site-builder-types";

const palette: { type: SiteBlockType; name: string; sign: string; description: string }[] = [
  { type: "hero", name: "Otwarcie", sign: "H1", description: "Nagłówek, opis i przycisk" },
  { type: "text", name: "Tekst", sign: "Aa", description: "Treść z dużym tytułem" },
  { type: "features", name: "Lista", sign: "03", description: "Korzyści lub usługi" },
  { type: "cta", name: "Wezwanie", sign: "↗", description: "Sekcja kończąca z akcją" },
  { type: "spacer", name: "Odstęp", sign: "↕", description: "Więcej oddechu" },
];

function emptyBlock(type: SiteBlockType): SiteBlock {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  if (type === "hero") return { id, type, kicker: "NOWA SEKCJA", title: "Mocny nagłówek Twojej strony.", body: "Dodaj krótki opis, który prowadzi do kolejnego kroku.", buttonLabel: "Zobacz więcej", buttonHref: "#", align: "left" };
  if (type === "text") return { id, type, kicker: "O NAS", title: "Opowiedz, dlaczego warto wybrać właśnie Ciebie.", body: "Tutaj możesz wpisać dłuższą historię, przedstawić sposób pracy albo najważniejszą ideę marki.", align: "left" };
  if (type === "features") return { id, type, kicker: "KONKRETY", title: "Najważniejsze elementy", items: ["Pierwsza korzyść", "Druga korzyść", "Trzecia korzyść"], align: "left" };
  if (type === "cta") return { id, type, title: "Gotowy na kolejny krok?", body: "Napisz lub wybierz dogodny termin.", buttonLabel: "Kontakt", buttonHref: "#kontakt", align: "center" };
  return { id, type };
}

export function SiteBuilder({ initialSite }: { initialSite: CustomerSite }) {
  const [site, setSite] = useState(initialSite);
  const [selectedId, setSelectedId] = useState(initialSite.blocks[0]?.id ?? "");
  const [status, setStatus] = useState("Wszystkie zmiany są lokalne");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [busy, setBusy] = useState(false);
  const selected = useMemo(() => site.blocks.find((block) => block.id === selectedId), [site.blocks, selectedId]);

  function setBlocks(blocks: SiteBlock[]) {
    setSite((current) => ({ ...current, blocks }));
    setStatus("Niezapisane zmiany");
  }

  function handleDrop(event: DragEvent, index: number) {
    event.preventDefault();
    const newType = event.dataTransfer.getData("application/webly-block-type") as SiteBlockType;
    const movedId = event.dataTransfer.getData("application/webly-block-id");
    if (newType) {
      const block = emptyBlock(newType);
      const next = [...site.blocks];
      next.splice(index, 0, block);
      setBlocks(next);
      setSelectedId(block.id);
      return;
    }
    if (movedId) {
      const from = site.blocks.findIndex((block) => block.id === movedId);
      if (from < 0) return;
      const next = [...site.blocks];
      const [block] = next.splice(from, 1);
      const target = from < index ? index - 1 : index;
      next.splice(target, 0, block);
      setBlocks(next);
    }
  }

  function updateSelected(patch: Partial<SiteBlock>) {
    setBlocks(site.blocks.map((block) => block.id === selectedId ? { ...block, ...patch } : block));
  }

  function removeSelected() {
    const index = site.blocks.findIndex((block) => block.id === selectedId);
    const next = site.blocks.filter((block) => block.id !== selectedId);
    setBlocks(next);
    setSelectedId(next[Math.max(0, index - 1)]?.id ?? "");
  }

  function moveSelected(direction: -1 | 1) {
    const index = site.blocks.findIndex((block) => block.id === selectedId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= site.blocks.length) return;
    const next = [...site.blocks];
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
  }

  async function save(publish = false) {
    setBusy(true);
    setStatus(publish ? "Publikuję…" : "Zapisuję…");
    try {
      const saved = await fetch(`/api/sites/${site.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: site.name, blocks: site.blocks }) });
      const savedResult = await saved.json() as { site?: CustomerSite; error?: string };
      if (!saved.ok || !savedResult.site) throw new Error(savedResult.error ?? "Nie udało się zapisać.");
      let nextSite = savedResult.site;
      if (publish) {
        const published = await fetch(`/api/sites/${site.id}/publish`, { method: "POST" });
        const publishResult = await published.json() as { site?: CustomerSite; error?: string };
        if (!published.ok || !publishResult.site) throw new Error(publishResult.error ?? "Nie udało się opublikować.");
        nextSite = publishResult.site;
      }
      setSite(nextSite);
      setStatus(publish ? "Opublikowano — strona jest online" : "Wersja robocza zapisana");
    } catch (saveError) {
      setStatus(saveError instanceof Error ? saveError.message : "Operacja nie powiodła się.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="builder-shell">
    <header className="builder-topbar"><Link href="/konto">← WITRYNY</Link><input aria-label="Nazwa witryny" value={site.name} onChange={(event) => { setSite((current) => ({ ...current, name: event.target.value })); setStatus("Niezapisane zmiany"); }} /><span className={`builder-status status-${site.status.toLowerCase()}`}>{status}</span><div className="builder-devices"><button className={device === "desktop" ? "active" : ""} onClick={() => setDevice("desktop")}>DESKTOP</button><button className={device === "mobile" ? "active" : ""} onClick={() => setDevice("mobile")}>MOBILE</button></div><button onClick={() => save(false)} disabled={busy}>ZAPISZ</button><button className="builder-publish" onClick={() => save(true)} disabled={busy}>OPUBLIKUJ ↗</button></header>
    <aside className="builder-palette"><span>SEKCJE</span><p>Przeciągnij element na stronę.</p>{palette.map((item) => <button key={item.type} draggable onDragStart={(event) => event.dataTransfer.setData("application/webly-block-type", item.type)}><b>{item.sign}</b><span><strong>{item.name}</strong><small>{item.description}</small></span><i>⠿</i></button>)}</aside>
    <main className={`builder-stage device-${device}`}><div className={`builder-page customer-site theme-${site.theme}`}><header className="customer-site-header"><strong>{site.name}</strong><span>MENU +</span></header><div className="builder-dropzone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, 0)}>UPUŚĆ SEKCJĘ TUTAJ</div>{site.blocks.map((block, index) => <div key={block.id}><article className={`builder-block${selectedId === block.id ? " selected" : ""}`} draggable onDragStart={(event) => event.dataTransfer.setData("application/webly-block-id", block.id)} onClick={() => setSelectedId(block.id)}><span className="builder-block-label">{String(index + 1).padStart(2, "0")} / {block.type.toUpperCase()} <i>⠿</i></span><SiteBlockView block={block} /></article><div className="builder-dropzone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, index + 1)}>+ UPUŚĆ LUB DODAJ SEKCJĘ</div></div>)}<footer className="customer-site-footer"><strong>{site.name}</strong><span>STRONA NA WEBLY</span></footer></div></main>
    <aside className="builder-inspector"><span>USTAWIENIA SEKCJI</span>{selected ? <><div className="inspector-type"><b>{selected.type.toUpperCase()}</b><div><button onClick={() => moveSelected(-1)}>↑</button><button onClick={() => moveSelected(1)}>↓</button><button onClick={removeSelected}>USUŃ</button></div></div>{selected.type !== "spacer" && <><label>Etykieta<input value={selected.kicker ?? ""} onChange={(event) => updateSelected({ kicker: event.target.value })} /></label><label>Nagłówek<textarea value={selected.title ?? ""} onChange={(event) => updateSelected({ title: event.target.value })} /></label>{selected.type !== "features" && <label>Opis<textarea value={selected.body ?? ""} onChange={(event) => updateSelected({ body: event.target.value })} /></label>}{selected.type === "features" && <label>Elementy listy<textarea value={(selected.items ?? []).join("\n")} onChange={(event) => updateSelected({ items: event.target.value.split("\n") })} /></label>}{(selected.type === "hero" || selected.type === "cta") && <><label>Tekst przycisku<input value={selected.buttonLabel ?? ""} onChange={(event) => updateSelected({ buttonLabel: event.target.value })} /></label><label>Adres przycisku<input value={selected.buttonHref ?? ""} onChange={(event) => updateSelected({ buttonHref: event.target.value })} /></label></>}<div className="inspector-align"><span>Wyrównanie</span><button className={selected.align !== "center" ? "active" : ""} onClick={() => updateSelected({ align: "left" })}>DO LEWEJ</button><button className={selected.align === "center" ? "active" : ""} onClick={() => updateSelected({ align: "center" })}>ŚRODEK</button></div></>}</> : <p>Wybierz sekcję na podglądzie.</p>}</aside>
  </div>;
}
