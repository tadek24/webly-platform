import { NextResponse } from "next/server";
import { getStoreData } from "@/lib/customer-data";
import { getCustomerSession } from "@/lib/customer-session";

export async function GET() {
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: "Zaloguj się ponownie." }, { status: 401 });
  try { return NextResponse.json({ store: await getStoreData(customer.id) }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się pobrać sklepu." }, { status: 500 }); }
}
