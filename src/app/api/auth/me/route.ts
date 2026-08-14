import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-session";

export async function GET() {
  const customer = await getCustomerSession();
  return customer ? NextResponse.json({ customer }) : NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
}

