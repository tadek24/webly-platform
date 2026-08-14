import { NewSiteWizard } from "@/components/new-site-wizard";

export default async function NewSitePage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  const { template } = await searchParams;
  return <main className="account-main"><section className="account-page-title"><span>NOWA WITRYNA</span><h1>Zacznij od kierunku,<br /><em>nie od pustej kartki.</em></h1><p>Po utworzeniu projektu od razu przejdziesz do edytora sekcji.</p></section><NewSiteWizard initialTemplateId={template} /></main>;
}

