import { notFound } from "next/navigation";
import { SiteBuilder } from "@/components/site-builder";
import { getCustomerSite } from "@/lib/customer-data";
import { requireCustomerSession } from "@/lib/customer-session";

export default async function BuilderPage({ params }: { params: Promise<{ siteId: string }> }) {
  const customer = await requireCustomerSession();
  const { siteId } = await params;
  let site;
  try { site = await getCustomerSite(customer.id, siteId); } catch { notFound(); }
  return <SiteBuilder initialSite={site} />;
}
