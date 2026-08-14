import { NextResponse } from "next/server";
import { z } from "zod";
import { updateStoreIntegrations } from "@/lib/customer-data";
import { getCustomerSession } from "@/lib/customer-session";

const schema = z.object({ selected: z.array(z.string().min(1).max(80)).max(30) });

export async function PUT(request: Request) {
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: "Zaloguj się ponownie." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Nieprawidłowa lista integracji." }, { status: 400 });
  try { return NextResponse.json({ store: await updateStoreIntegrations(customer.id, parsed.data.selected) }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się zapisać integracji." }, { status: 500 }); }
}
