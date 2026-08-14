import { bridgeRequest } from "@/lib/wordpress-bridge";
import type { CustomerSite, CustomerSubscription, ImageAsset, PackageDefinition, SiteBlock, SiteKind, StoreData, StoreProduct } from "@/lib/site-builder-types";

type SitesResponse = { sites: CustomerSite[] };
type SiteResponse = { site: CustomerSite };
type SubscriptionResponse = { subscription: CustomerSubscription };

export async function getCustomerSites(customerId: number) {
  return (await bridgeRequest<SitesResponse>("/customer/sites", { searchParams: { customerId } })).sites;
}

export async function getCustomerSite(customerId: number, siteId: string) {
  return (await bridgeRequest<SiteResponse>(`/customer/sites/${encodeURIComponent(siteId)}`, { searchParams: { customerId } })).site;
}

export async function createCustomerSite(input: { customerId: number; name: string; templateId: string; kind: SiteKind; theme: string; blocks: SiteBlock[] }) {
  return (await bridgeRequest<SiteResponse>("/customer/sites", { method: "POST", body: input })).site;
}

export async function updateCustomerSite(customerId: number, siteId: string, input: { name?: string; blocks?: SiteBlock[] }) {
  return (await bridgeRequest<SiteResponse>(`/customer/sites/${encodeURIComponent(siteId)}`, { method: "PUT", body: { customerId, ...input } })).site;
}

export async function publishCustomerSite(customerId: number, siteId: string) {
  return (await bridgeRequest<SiteResponse>(`/customer/sites/${encodeURIComponent(siteId)}/publish`, { method: "POST", body: { customerId } })).site;
}

export async function deleteCustomerSite(customerId: number, siteId: string) {
  return bridgeRequest<{ ok: true }>(`/customer/sites/${encodeURIComponent(siteId)}`, { method: "DELETE", body: { customerId } });
}

export async function getSubscription(customerId: number) {
  return (await bridgeRequest<SubscriptionResponse>("/customer/subscription", { searchParams: { customerId } })).subscription;
}

export async function updateSubscription(customerId: number, plan: CustomerSubscription["plan"]) {
  return (await bridgeRequest<SubscriptionResponse>("/customer/subscription", { method: "PUT", body: { customerId, plan } })).subscription;
}

export async function getPublishedSite(slug: string) {
  return (await bridgeRequest<SiteResponse>("/site/public", { authenticated: false, searchParams: { slug }, cache: "no-store" })).site;
}

export async function getCustomerMedia(customerId: number) {
  return (await bridgeRequest<{ media: ImageAsset[] }>("/customer/media", { searchParams: { customerId } })).media;
}

export async function uploadCustomerMedia(input: { customerId: number; fileName: string; mimeType: string; data: string }) {
  return (await bridgeRequest<{ asset: ImageAsset }>("/customer/media", { method: "POST", body: input })).asset;
}

export async function getPackages() {
  return (await bridgeRequest<{ packages: PackageDefinition[] }>("/packages")).packages;
}

export async function getStoreData(customerId: number) {
  return (await bridgeRequest<{ store: StoreData }>("/customer/store", { searchParams: { customerId } })).store;
}

export async function addStoreProduct(customerId: number, product: Omit<StoreProduct, "id">) {
  return (await bridgeRequest<{ store: StoreData }>("/customer/store/products", { method: "POST", body: { customerId, product } })).store;
}

export async function updateStoreIntegrations(customerId: number, selected: string[]) {
  return (await bridgeRequest<{ store: StoreData }>("/customer/store/integrations", { method: "PUT", body: { customerId, selected } })).store;
}
