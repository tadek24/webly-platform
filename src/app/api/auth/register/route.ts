import { NextResponse } from "next/server";
import { z } from "zod";
import { bridgeRequest, BridgeError } from "@/lib/wordpress-bridge";
import { createCustomerSessionToken, CUSTOMER_SESSION_COOKIE, customerSessionCookieOptions } from "@/lib/customer-session";
import type { CustomerProfile } from "@/lib/site-builder-types";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Podaj imię lub nazwę firmy.").max(80),
  email: z.string().email("Podaj poprawny adres e-mail."),
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków.").max(128),
});

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Sprawdź formularz." }, { status: 400 });

  try {
    const result = await bridgeRequest<{ customer: CustomerProfile }>("/customer/auth/register", { method: "POST", body: parsed.data });
    const customer: CustomerProfile = { ...result.customer, role: "CUSTOMER" };
    const response = NextResponse.json({ ok: true, customer });
    response.cookies.set(CUSTOMER_SESSION_COOKIE, createCustomerSessionToken(customer), customerSessionCookieOptions);
    return response;
  } catch (error) {
    const status = error instanceof BridgeError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się utworzyć konta." }, { status });
  }
}
