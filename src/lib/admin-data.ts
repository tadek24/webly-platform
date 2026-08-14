import { bridgeRequest } from "@/lib/wordpress-bridge";
import type { AdminCustomer, AdminOverview, CustomerSubscription, PackageDefinition } from "@/lib/site-builder-types";

export async function getAdminOverview() {
  return (await bridgeRequest<{ overview: AdminOverview }>("/admin/overview")).overview;
}

export async function updateAdminCustomer(customerId: number, input: {
  plan?: CustomerSubscription["plan"];
  status?: CustomerSubscription["status"];
  access?: "ACTIVE" | "SUSPENDED";
}) {
  return (await bridgeRequest<{ customer: AdminCustomer }>(`/admin/customers/${customerId}`, { method: "PUT", body: input })).customer;
}

export async function updatePackages(packages: PackageDefinition[]) {
  return (await bridgeRequest<{ packages: PackageDefinition[] }>("/packages", { method: "PUT", body: { packages } })).packages;
}
