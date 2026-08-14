import { NextResponse } from "next/server";
import { z } from "zod";
import { getCustomerSession } from "@/lib/customer-session";
import { getSubscription, updateSubscription } from "@/lib/customer-data";

export async function GET() {
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: "Zaloguj się ponownie." }, { status: 401 });
  try {
    return NextResponse.json({ subscription: await getSubscription(customer.id) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się pobrać abonamentu." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: "Zaloguj się ponownie." }, { status: 401 });
  const parsed = z.object({ plan: z.enum(["START", "PRO", "COMMERCE", "OMNICHANNEL"]) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Nieprawidłowy plan." }, { status: 400 });
  try {
    return NextResponse.json({ subscription: await updateSubscription(customer.id, parsed.data.plan) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się zmienić planu." }, { status: 500 });
  }
}
