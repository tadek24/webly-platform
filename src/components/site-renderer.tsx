import type { CSSProperties } from "react";
import type { CustomerSite, SiteBlock } from "@/lib/site-builder-types";

function sectionStyle(block: SiteBlock): CSSProperties {
  const settings = block.style;
  const overlay = Math.min(80, Math.max(0, settings?.overlay ?? 0)) / 100;
  return {
    backgroundColor: settings?.backgroundColor,
    color: settings?.textColor,
    backgroundImage: settings?.backgroundImage
      ? `linear-gradient(rgba(0,0,0,${overlay}), rgba(0,0,0,${overlay})), url("${settings.backgroundImage}")`
      : undefined,
    backgroundPosition: settings?.backgroundPosition ?? "center",
    backgroundSize: settings?.backgroundImage ? "cover" : undefined,
  };
}

function sectionClass(block: SiteBlock, extra: string) {
  const padding = block.style?.padding ?? "normal";
  const width = block.style?.width ?? "wide";
  return `customer-site-section ${extra} align-${block.align ?? "left"} pad-${padding} width-${width}${block.style?.backgroundImage ? " has-bg-image" : ""}`;
}

function Label({ block }: { block: SiteBlock }) {
  return block.kicker ? <small>{block.kicker}</small> : null;
}

export function SiteBlockView({ block }: { block: SiteBlock }) {
  if (block.type === "spacer") return <div className="customer-site-spacer" style={{ height: block.style?.padding === "compact" ? 60 : block.style?.padding === "airy" ? 190 : 120 }} aria-hidden="true" />;
  if (block.type === "divider") return <div className="customer-site-divider"><span /></div>;

  if (block.type === "features") {
    return <section className={sectionClass(block, "customer-site-features")} style={sectionStyle(block)}>
      <Label block={block} /><h2>{block.title}</h2>
      <div>{(block.items ?? []).map((item, index) => <article key={`${item}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3></article>)}</div>
    </section>;
  }

  if (block.type === "image") {
    return <section className={sectionClass(block, "customer-site-image")} style={sectionStyle(block)}>
      <Label block={block} />{block.title && <h2>{block.title}</h2>}
      {block.imageUrl ? <figure><img src={block.imageUrl} alt={block.imageAlt ?? ""} /><figcaption>{block.body}</figcaption></figure> : <div className="customer-image-placeholder">DODAJ ZDJĘCIE</div>}
    </section>;
  }

  if (block.type === "gallery") {
    return <section className={sectionClass(block, "customer-site-gallery")} style={sectionStyle(block)}>
      <Label block={block} />{block.title && <h2>{block.title}</h2>}
      <div>{(block.images ?? []).length ? block.images!.map((image, index) => <figure key={`${image.url}-${index}`}><img src={image.url} alt={image.alt} /></figure>) : <div className="customer-image-placeholder">DODAJ ZDJĘCIA DO GALERII</div>}</div>
    </section>;
  }

  if (block.type === "quote") {
    return <section className={sectionClass(block, "customer-site-quote")} style={sectionStyle(block)}><Label block={block} /><blockquote>„{block.title}”</blockquote>{block.body && <cite>{block.body}</cite>}</section>;
  }

  if (block.type === "stats") {
    return <section className={sectionClass(block, "customer-site-stats")} style={sectionStyle(block)}><Label block={block} />{block.title && <h2>{block.title}</h2>}<div>{(block.items ?? []).map((item, index) => { const [value, label] = item.split("|"); return <article key={`${item}-${index}`}><strong>{value}</strong><span>{label ?? ""}</span></article>; })}</div></section>;
  }

  if (block.type === "products") {
    return <section className={sectionClass(block, "customer-site-products")} style={sectionStyle(block)}><Label block={block} /><h2>{block.title}</h2><div>{(block.items ?? []).map((item, index) => { const [name, price] = item.split("|"); const image = block.images?.[index]; return <article key={`${item}-${index}`}>{image ? <img src={image.url} alt={image.alt} /> : <div className="product-image-placeholder">PRODUKT</div>}<h3>{name}</h3><strong>{price ?? ""}</strong><button>DODAJ DO KOSZYKA</button></article>; })}</div></section>;
  }

  if (block.type === "contact") {
    return <section className={sectionClass(block, "customer-site-contact")} style={sectionStyle(block)}><div><Label block={block} /><h2>{block.title}</h2>{block.body && <p>{block.body}</p>}</div><form><label>Imię<input type="text" /></label><label>E-mail<input type="email" /></label><label>Wiadomość<textarea rows={4} /></label><button type="button">WYŚLIJ WIADOMOŚĆ →</button></form></section>;
  }

  if (block.type === "cta") {
    return <section className={sectionClass(block, "customer-site-cta")} style={sectionStyle(block)}><h2>{block.title}</h2>{block.body && <p>{block.body}</p>}{block.buttonLabel && <a href={block.buttonHref || "#"}>{block.buttonLabel} ↗</a>}</section>;
  }

  if (block.type === "hero") {
    return <section className={sectionClass(block, "customer-site-hero")} style={sectionStyle(block)}>
      <Label block={block} /><h1>{block.title}</h1>{block.body && <p>{block.body}</p>}{block.buttonLabel && <a href={block.buttonHref || "#"}>{block.buttonLabel} ↗</a>}
    </section>;
  }

  return <section className={sectionClass(block, "customer-site-text")} style={sectionStyle(block)}><Label block={block} /><h2>{block.title}</h2>{block.body && <p>{block.body}</p>}</section>;
}

export function SiteRenderer({ site, compact = false }: { site: CustomerSite; compact?: boolean }) {
  return <div className={`customer-site theme-${site.theme}${compact ? " is-compact" : ""}`}>
    <header className="customer-site-header"><strong>{site.name}</strong><span>MENU +</span></header>
    <main>{site.blocks.map((block) => <SiteBlockView key={block.id} block={block} />)}</main>
    <footer className="customer-site-footer"><strong>{site.name}</strong><span>STRONA NA WEBLY</span></footer>
  </div>;
}
