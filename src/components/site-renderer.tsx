import type { CustomerSite, SiteBlock } from "@/lib/site-builder-types";

export function SiteBlockView({ block }: { block: SiteBlock }) {
  if (block.type === "spacer") return <div className="customer-site-spacer" aria-hidden="true" />;

  if (block.type === "features") {
    return <section className={`customer-site-section customer-site-features align-${block.align ?? "left"}`}>
      {block.kicker && <small>{block.kicker}</small>}
      <h2>{block.title}</h2>
      <div>{(block.items ?? []).map((item, index) => <article key={`${item}-${index}`}><span>0{index + 1}</span><h3>{item}</h3></article>)}</div>
    </section>;
  }

  if (block.type === "cta") {
    return <section className={`customer-site-section customer-site-cta align-${block.align ?? "center"}`}><h2>{block.title}</h2>{block.body && <p>{block.body}</p>}{block.buttonLabel && <a href={block.buttonHref || "#"}>{block.buttonLabel} ↗</a>}</section>;
  }

  if (block.type === "hero") {
    return <section className={`customer-site-section customer-site-hero align-${block.align ?? "left"}`}>
      {block.kicker && <small>{block.kicker}</small>}
      <h1>{block.title}</h1>
      {block.body && <p>{block.body}</p>}
      {block.buttonLabel && <a href={block.buttonHref || "#"}>{block.buttonLabel} ↗</a>}
    </section>;
  }

  return <section className={`customer-site-section customer-site-text align-${block.align ?? "left"}`}>
    {block.kicker && <small>{block.kicker}</small>}
    <h2>{block.title}</h2>
    {block.body && <p>{block.body}</p>}
  </section>;
}

export function SiteRenderer({ site, compact = false }: { site: CustomerSite; compact?: boolean }) {
  return (
    <div className={`customer-site theme-${site.theme}${compact ? " is-compact" : ""}`}>
      <header className="customer-site-header"><strong>{site.name}</strong><span>MENU +</span></header>
      <main>{site.blocks.map((block) => <SiteBlockView key={block.id} block={block} />)}</main>
      <footer className="customer-site-footer"><strong>{site.name}</strong><span>STRONA NA WEBLY</span></footer>
    </div>
  );
}
