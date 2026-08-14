import { NextResponse } from "next/server";
import { z } from "zod";
import { updatePackages } from "@/lib/admin-data";
import { getPackages } from "@/lib/customer-data";
import { getCustomerSession } from "@/lib/customer-session";

const packageSchema = z.object({
  id: z.enum(["START", "PRO", "COMMERCE", "OMNICHANNEL"]),
  name: z.string().min(2).max(60),
  price: z.number().min(0),
  setup: z.number().min(0),
  description: z.string().max(240),
  audience: z.string().max(160),
  siteLimit: z.number().int().min(1).max(100),
  features: z.array(z.string().min(1).max(100)).max(12),
});

async function isAdmin() {
  const session = await getCustomerSession();
  return session?.role === "ADMIN";
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Brak dostępu." }, { status: 403 });
  try { return NextResponse.json({ packages: await getPackages() }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się pobrać pakietów." }, { status: 500 }); }
}

export async function PUT(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Brak dostępu." }, { status: 403 });
  const parsed = z.object({ packages: z.array(packageSchema).min(3).max(4) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Sprawdź ceny i zawartość pakietów." }, { status: 400 });
  try { return NextResponse.json({ packages: await updatePackages(parsed.data.packages) }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się zapisać pakietów." }, { status: 500 }); }
}
