import { NextResponse } from "next/server";
import { z } from "zod";
import { updateAdminCustomer } from "@/lib/admin-data";
import { getCustomerSession } from "@/lib/customer-session";

const schema = z.object({
  plan: z.enum(["START", "PRO", "COMMERCE", "OMNICHANNEL"]).optional(),
  status: z.enum(["TRIALING", "ACTIVE", "PAST_DUE", "CANCELED"]).optional(),
  access: z.enum(["ACTIVE", "SUSPENDED"]).optional(),
});

export async function PUT(request: Request, context: { params: Promise<{ customerId: string }> }) {
  const admin = await getCustomerSession();
  if (!admin || admin.role !== "ADMIN") return NextResponse.json({ error: "Brak dostępu." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  const { customerId } = await context.params;
  const id = Number(customerId);
  if (!parsed.success || !Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Nieprawidłowe dane klienta." }, { status: 400 });
  try {
    return NextResponse.json({ customer: await updateAdminCustomer(id, parsed.data) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się zapisać klienta." }, { status: 500 });
  }
}
