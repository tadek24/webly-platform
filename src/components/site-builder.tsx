"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { SiteBlockView } from "@/components/site-renderer";
import type { CustomerSite, ImageAsset, SiteBlock, SiteBlockType } from "@/lib/site-builder-types";

const palette: { type: SiteBlockType; name: string; sign: string; description: string; group: "TREŚĆ" | "MEDIA" | "SPRZEDAŻ" | "UKŁAD" }[] = [
  { type: "hero", name: "Otwarcie", sign: "H1", description: "Nagłówek, opis i przycisk", group: "TREŚĆ" },
  { type: "text", name: "Tekst", sign: "Aa", description: "Treść z dużym tytułem", group: "TREŚĆ" },
  { type: "features", name: "Lista", sign: "03", description: "Korzyści lub usługi", group: "TREŚĆ" },
  { type: "quote", name: "Cytat", sign: "„ ”", description: "Opinia lub manifest", group: "TREŚĆ" },
  { type: "stats", name: "Liczby", sign: "99", description: "Wyniki i statystyki", group: "TREŚĆ" },
  { type: "image", name: "Zdjęcie", sign: "▧", description: "Pojedynczy duży kadr", group: "MEDIA" },
  { type: "gallery", name: "Galeria", sign: "▦", description: "Siatka wielu zdjęć", group: "MEDIA" },
  { type: "products", name: "Produkty", sign: "¤", description: "Karty produktów sklepu", group: "SPRZEDAŻ" },
  { type: "contact", name: "Formularz", sign: "@", description: "Kontakt i zapytania", group: "SPRZEDAŻ" },
  { type: "cta", name: "Wezwanie", sign: "↗", description: "Sekcja kończąca z akcją", group: "TREŚĆ" },
  { type: "divider", name: "Linia", sign: "—", description: "Podział zawartości", group: "UKŁAD" },
  { type: "spacer", name: "Odstęp", sign: "↕", description: "Więcej oddechu", group: "UKŁAD" },
];

function emptyBlock(type: SiteBlockType): SiteBlock {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const base = { id, type, align: "left" as const, style: { padding: "normal" as const, width: "wide" as const } };
  if (type === "hero") return { ...base, kicker: "NOWA SEKCJA", title: "Mocny nagłówek Twojej strony.", body: "Dodaj krótki opis, który prowadzi do kolejnego kroku.", buttonLabel: "Zobacz więcej", buttonHref: "#" };
  if (type === "text") return { ...base, kicker: "O NAS", title: "Opowiedz, dlaczego warto wybrać właśnie Ciebie.", body: "Tutaj możesz wpisać dłuższą historię, sposób pracy albo najważniejszą ideę marki." };
  if (type === "features") return { ...base, kicker: "KONKRETY", title: "Najważniejsze elementy", items: ["Pierwsza korzyść", "Druga korzyść", "Trzecia korzyść"] };
  if (type === "image") return { ...base, kicker: "KADR", title: "Obraz, który opowiada historię.", body: "Opcjonalny podpis pod zdjęciem.", imageAlt: "Opis zdjęcia" };
  if (type === "gallery") return { ...base, kicker: "GALERIA", title: "Wybrane realizacje", images: [] };
  if (type === "quote") return { ...base, kicker: "OPINIA", title: "Najlepsza współpraca zaczyna się od dobrej rozmowy.", body: "Anna Kowalska / klientka" };
  if (type === "stats") return { ...base, kicker: "W LICZBACH", title: "Doświadczenie, które widać", items: ["120+|projektów", "8 lat|doświadczenia", "96%|poleceń"] };
  if (type === "products") return { ...base, kicker: "SKLEP", title: "Wybrane produkty", items: ["Produkt pierwszy|149 zł", "Produkt drugi|229 zł", "Produkt trzeci|89 zł"], images: [] };
  if (type === "contact") return { ...base, kicker: "KONTAKT", title: "Porozmawiajmy o Twoim projekcie.", body: "Odpowiadamy zwykle w ciągu jednego dnia roboczego." };
  if (type === "cta") return { ...base, title: "Gotowy na kolejny krok?", body: "Napisz lub wybierz dogodny termin.", buttonLabel: "Kontakt", buttonHref: "#kontakt", align: "center" };
  return base;
}

export function SiteBuilder({ initialSite, initialMedia = [] }: { initialSite: CustomerSite; initialMedia?: ImageAsset[] }) {
  const [site, setSite] = useState(initialSite);
  const [media, setMedia] = useState(initialMedia);
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
      next.splice(from < index ? index - 1 : index, 0, block);
      setBlocks(next);
    }
  }

  function updateSelected(patch: Partial<SiteBlock>) {
    setBlocks(site.blocks.map((block) => block.id === selectedId ? { ...block, ...patch } : block));
  }

  function updateStyle(patch: NonNullable<SiteBlock["style"]>) {
    if (!selected) return;
    updateSelected({ style: { ...(selected.style ?? {}), ...patch } });
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

  async function uploadImage(event: ChangeEvent<HTMLInputElement>, usage: "content" | "background") {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !selected) return;
    if (file.size > 4 * 1024 * 1024) { setStatus("Zdjęcie może mieć maksymalnie 4 MB"); return; }
    setBusy(true);
    setStatus("Wysyłam zdjęcie do biblioteki…");
    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch("/api/media", { method: "POST", body: formData });
      const result = await response.json() as { asset?: ImageAsset; error?: string };
      if (!response.ok || !result.asset) throw new Error(result.error ?? "Nie udało się wysłać zdjęcia.");
      setMedia((current) => [result.asset!, ...current.filter((item) => item.url !== result.asset!.url)]);
      applyAsset(result.asset, usage);
      setStatus("Zdjęcie dodane — zapisz projekt");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Nie udało się wysłać zdjęcia.");
    } finally { setBusy(false); }
  }

  function applyAsset(asset: ImageAsset, usage: "content" | "background") {
    if (!selected) return;
    if (usage === "background") { updateStyle({ backgroundImage: asset.url }); return; }
    if (selected.type === "gallery" || selected.type === "products") updateSelected({ images: [...(selected.images ?? []), asset] });
    else updateSelected({ imageUrl: asset.url, imageAlt: selected.imageAlt || asset.alt });
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
    } catch (error) { setStatus(error instanceof Error ? error.message : "Operacja nie powiodła się."); }
    finally { setBusy(false); }
  }

  const itemLabel = selected?.type === "stats" ? "Elementy: wartość|opis" : selected?.type === "products" ? "Produkty: nazwa|cena" : "Elementy listy";

  return <div className="builder-shell builder-shell-v2">
    <header className="builder-topbar"><Link href="/konto">← WITRYNY</Link><input aria-label="Nazwa witryny" value={site.name} onChange={(event) => { setSite((current) => ({ ...current, name: event.target.value })); setStatus("Niezapisane zmiany"); }} /><span className={`builder-status status-${site.status.toLowerCase()}`}>{status}</span><div className="builder-devices"><button className={device === "desktop" ? "active" : ""} onClick={() => setDevice("desktop")}>DESKTOP</button><button className={device === "mobile" ? "active" : ""} onClick={() => setDevice("mobile")}>MOBILE</button></div><button onClick={() => save(false)} disabled={busy}>ZAPISZ</button><button className="builder-publish" onClick={() => save(true)} disabled={busy}>OPUBLIKUJ ↗</button></header>
    <aside className="builder-palette"><span>ELEMENTY / {palette.length}</span><p>Przeciągnij element w wybrane miejsce strony.</p>{palette.map((item, index) => <div key={item.type}>{index === 0 || palette[index - 1].group !== item.group ? <small className="palette-group">{item.group}</small> : null}<button draggable onDragStart={(event) => event.dataTransfer.setData("application/webly-block-type", item.type)} onClick={() => { const block = emptyBlock(item.type); setBlocks([...site.blocks, block]); setSelectedId(block.id); }}><b>{item.sign}</b><span><strong>{item.name}</strong><small>{item.description}</small></span><i>⠿</i></button></div>)}</aside>
    <main className={`builder-stage device-${device}`}><div className={`builder-page customer-site theme-${site.theme}`}><header className="customer-site-header"><strong>{site.name}</strong><span>MENU +</span></header><div className="builder-dropzone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, 0)}>UPUŚĆ SEKCJĘ TUTAJ</div>{site.blocks.map((block, index) => <div key={block.id}><article className={`builder-block${selectedId === block.id ? " selected" : ""}`} draggable onDragStart={(event) => event.dataTransfer.setData("application/webly-block-id", block.id)} onClick={() => setSelectedId(block.id)}><span className="builder-block-label">{String(index + 1).padStart(2, "0")} / {block.type.toUpperCase()} <i>⠿</i></span><SiteBlockView block={block} /></article><div className="builder-dropzone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, index + 1)}>+ UPUŚĆ LUB DODAJ SEKCJĘ</div></div>)}<footer className="customer-site-footer"><strong>{site.name}</strong><span>STRONA NA WEBLY</span></footer></div></main>
    <aside className="builder-inspector"><span>USTAWIENIA SEKCJI</span>{selected ? <>
      <div className="inspector-type"><b>{selected.type.toUpperCase()}</b><div><button onClick={() => moveSelected(-1)}>↑</button><button onClick={() => moveSelected(1)}>↓</button><button onClick={removeSelected}>USUŃ</button></div></div>
      {selected.type !== "spacer" && selected.type !== "divider" && <details open className="inspector-panel"><summary>TREŚĆ</summary>
        <label>Etykieta<input value={selected.kicker ?? ""} onChange={(event) => updateSelected({ kicker: event.target.value })} /></label>
        <label>Nagłówek<textarea value={selected.title ?? ""} onChange={(event) => updateSelected({ title: event.target.value })} /></label>
        {!(["features", "stats", "products", "gallery"] as SiteBlockType[]).includes(selected.type) && <label>Opis<textarea value={selected.body ?? ""} onChange={(event) => updateSelected({ body: event.target.value })} /></label>}
        {(["features", "stats", "products"] as SiteBlockType[]).includes(selected.type) && <label>{itemLabel}<textarea value={(selected.items ?? []).join("\n")} onChange={(event) => updateSelected({ items: event.target.value.split("\n").filter(Boolean) })} /></label>}
        {(selected.type === "hero" || selected.type === "cta") && <><label>Tekst przycisku<input value={selected.buttonLabel ?? ""} onChange={(event) => updateSelected({ buttonLabel: event.target.value })} /></label><label>Adres przycisku<input value={selected.buttonHref ?? ""} onChange={(event) => updateSelected({ buttonHref: event.target.value })} /></label></>}
      </details>}
      {(["image", "gallery", "products"] as SiteBlockType[]).includes(selected.type) && <details open className="inspector-panel"><summary>ZDJĘCIE / GALERIA</summary><label className="media-upload-button">+ WGRAJ ZDJĘCIE<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => uploadImage(event, "content")} disabled={busy} /></label>{selected.type === "image" && <><label>Adres zdjęcia<input value={selected.imageUrl ?? ""} onChange={(event) => updateSelected({ imageUrl: event.target.value })} /></label><label>Opis ALT<input value={selected.imageAlt ?? ""} onChange={(event) => updateSelected({ imageAlt: event.target.value })} /></label></>}</details>}
      {selected.type !== "spacer" && selected.type !== "divider" && <details open className="inspector-panel"><summary>TŁO I UKŁAD</summary>
        <label className="media-upload-button">+ USTAW ZDJĘCIE W TLE<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => uploadImage(event, "background")} disabled={busy} /></label>
        {selected.style?.backgroundImage && <div className="background-preview" style={{ backgroundImage: `url(${selected.style.backgroundImage})` }}><button onClick={() => updateStyle({ backgroundImage: "" })}>USUŃ TŁO</button></div>}
        <div className="inspector-colors"><label>Kolor tła<input type="color" value={selected.style?.backgroundColor || "#f1eee6"} onChange={(event) => updateStyle({ backgroundColor: event.target.value })} /></label><label>Kolor tekstu<input type="color" value={selected.style?.textColor || "#151512"} onChange={(event) => updateStyle({ textColor: event.target.value })} /></label></div>
        <label>Pozycja tła<select value={selected.style?.backgroundPosition ?? "center"} onChange={(event) => updateStyle({ backgroundPosition: event.target.value as NonNullable<SiteBlock["style"]>["backgroundPosition"] })}><option value="center">Środek</option><option value="top">Góra</option><option value="bottom">Dół</option><option value="left">Lewa</option><option value="right">Prawa</option></select></label>
        <label>Przyciemnienie: {selected.style?.overlay ?? 0}%<input type="range" min="0" max="80" value={selected.style?.overlay ?? 0} onChange={(event) => updateStyle({ overlay: Number(event.target.value) })} /></label>
        <label>Odstępy<select value={selected.style?.padding ?? "normal"} onChange={(event) => updateStyle({ padding: event.target.value as NonNullable<SiteBlock["style"]>["padding"] })}><option value="compact">Kompaktowe</option><option value="normal">Standardowe</option><option value="airy">Duże</option></select></label>
        <div className="inspector-align"><span>Wyrównanie</span><button className={selected.align !== "center" ? "active" : ""} onClick={() => updateSelected({ align: "left" })}>DO LEWEJ</button><button className={selected.align === "center" ? "active" : ""} onClick={() => updateSelected({ align: "center" })}>ŚRODEK</button></div>
      </details>}
      {media.length > 0 && <details className="inspector-panel media-library"><summary>BIBLIOTEKA MEDIÓW ({media.length})</summary><div>{media.slice(0, 12).map((asset) => <article key={asset.url}><img src={asset.url} alt={asset.alt} /><button onClick={() => applyAsset(asset, "content")}>UŻYJ</button><button onClick={() => applyAsset(asset, "background")}>TŁO</button></article>)}</div></details>}
    </> : <p>Wybierz sekcję na podglądzie.</p>}</aside>
  </div>;
}
