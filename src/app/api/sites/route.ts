import { NextResponse } from "next/server";
import { z } from "zod";
import { getCustomerSession } from "@/lib/customer-session";
import { createCustomerSite, getCustomerSites } from "@/lib/customer-data";
import { getSiteTemplate } from "@/lib/site-templates";

const createSchema = z.object({ name: z.string().trim().min(2, "Podaj nazwę witryny.").max(80), templateId: z.string().min(1) });

export async function GET() {
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: "Zaloguj się ponownie." }, { status: 401 });

  try {
    return NextResponse.json({ sites: await getCustomerSites(customer.id) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się pobrać witryn." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: "Zaloguj się ponownie." }, { status: 401 });

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Sprawdź formularz." }, { status: 400 });

  const template = getSiteTemplate(parsed.data.templateId);
  if (!template) return NextResponse.json({ error: "Nie znaleziono wybranego szablonu." }, { status: 404 });

  try {
    const site = await createCustomerSite({
      customerId: customer.id,
      name: parsed.data.name,
      templateId: template.id,
      kind: template.kind,
      theme: template.theme,
      blocks: template.blocks,
    });
    return NextResponse.json({ site }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się utworzyć witryny." }, { status: 500 });
  }
}

