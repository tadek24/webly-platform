import { NextResponse } from "next/server";
import { z } from "zod";
import { getCustomerSession } from "@/lib/customer-session";
import { deleteCustomerSite, getCustomerSite, updateCustomerSite } from "@/lib/customer-data";

const blockSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["hero", "text", "features", "cta", "spacer"]),
  kicker: z.string().max(120).optional(),
  title: z.string().max(220).optional(),
  body: z.string().max(1600).optional(),
  buttonLabel: z.string().max(80).optional(),
  buttonHref: z.string().max(220).optional(),
  items: z.array(z.string().max(160)).max(8).optional(),
  align: z.enum(["left", "center"]).optional(),
});
const updateSchema = z.object({ name: z.string().trim().min(2).max(80).optional(), blocks: z.array(blockSchema).max(30).optional() });

export async function GET(_: Request, context: { params: Promise<{ siteId: string }> }) {
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: "Zaloguj się ponownie." }, { status: 401 });
  try {
    const { siteId } = await context.params;
    return NextResponse.json({ site: await getCustomerSite(customer.id, siteId) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Nie znaleziono witryny." }, { status: 404 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ siteId: string }> }) {
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: "Zaloguj się ponownie." }, { status: 401 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Sprawdź treści." }, { status: 400 });
  try {
    const { siteId } = await context.params;
    return NextResponse.json({ site: await updateCustomerSite(customer.id, siteId, parsed.data) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się zapisać zmian." }, { status: 500 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ siteId: string }> }) {
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: "Zaloguj się ponownie." }, { status: 401 });
  try {
    const { siteId } = await context.params;
    await deleteCustomerSite(customer.id, siteId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się usunąć witryny." }, { status: 500 });
  }
}

