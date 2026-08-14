import { NextResponse } from "next/server";
import { z } from "zod";
import { addStoreProduct } from "@/lib/customer-data";
import { getCustomerSession } from "@/lib/customer-session";

const productSchema = z.object({ name: z.string().trim().min(2).max(120), sku: z.string().trim().min(1).max(80), price: z.number().min(0).max(10000000), stock: z.number().int().min(0).max(1000000), status: z.enum(["ACTIVE", "DRAFT"]), imageUrl: z.string().url().optional().or(z.literal("")) });

export async function POST(request: Request) {
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: "Zaloguj się ponownie." }, { status: 401 });
  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Sprawdź produkt." }, { status: 400 });
  try { return NextResponse.json({ store: await addStoreProduct(customer.id, parsed.data) }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się dodać produktu." }, { status: 500 }); }
}
