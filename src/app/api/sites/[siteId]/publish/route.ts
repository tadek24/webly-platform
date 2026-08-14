import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-session";
import { publishCustomerSite } from "@/lib/customer-data";

export async function POST(_: Request, context: { params: Promise<{ siteId: string }> }) {
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: "Zaloguj się ponownie." }, { status: 401 });
  try {
    const { siteId } = await context.params;
    const site = await publishCustomerSite(customer.id, siteId);
    revalidatePath(`/s/${site.slug}`);
    return NextResponse.json({ site });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się opublikować witryny." }, { status: 500 });
  }
}

