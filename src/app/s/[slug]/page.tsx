import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteRenderer } from "@/components/site-renderer";
import { getPublishedSite } from "@/lib/customer-data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try { const site = await getPublishedSite(slug); return { title: site.name, description: site.blocks.find((block) => block.type === "hero")?.body, robots: { index: true, follow: true } }; } catch { return { title: "Nie znaleziono strony", robots: { index: false, follow: false } }; }
}

export default async function PublishedCustomerSite({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let site;
  try { site = await getPublishedSite(slug); } catch { notFound(); }
  return <SiteRenderer site={site} />;
}
