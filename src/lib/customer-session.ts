import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { CustomerProfile } from "@/lib/site-builder-types";

export const CUSTOMER_SESSION_COOKIE = "webly_customer_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = CustomerProfile & { exp: number };

function sessionSecret() {
  const secret = process.env.SESSION_SECRET ?? process.env.WP_API_TOKEN;
  if (!secret) throw new Error("SESSION_NOT_CONFIGURED");
  return secret;
}

function signature(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export function createCustomerSessionToken(customer: CustomerProfile) {
  const payload: SessionPayload = { ...customer, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signature(encoded)}`;
}

export function verifyCustomerSessionToken(token?: string | null): CustomerProfile | null {
  if (!token) return null;
  const [encoded, providedSignature] = token.split(".");
  if (!encoded || !providedSignature) return null;

  try {
    const expectedSignature = signature(encoded);
    const provided = Buffer.from(providedSignature);
    const expected = Buffer.from(expectedSignature);
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;

    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.id || !payload.email || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: payload.id, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

export async function getCustomerSession() {
  const cookieStore = await cookies();
  return verifyCustomerSessionToken(cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value);
}

export async function requireCustomerSession() {
  const customer = await getCustomerSession();
  if (!customer) redirect("/logowanie?next=/konto");
  return customer;
}

export const customerSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_SECONDS,
};

