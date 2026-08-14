export function PageIntro({ index, kicker, title, italic, lead }: { index: string; kicker: string; title: string; italic: string; lead: string }) {
  return (
    <section className="page-intro section-grid">
      <p className="section-index">{index} / {kicker}</p>
      <div><h1>{title}<br /><em>{italic}</em></h1><p>{lead}</p></div>
    </section>
  );
}

