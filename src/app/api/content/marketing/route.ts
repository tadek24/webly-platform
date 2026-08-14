import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_MARKETING_CONTENT, type MarketingContentKey } from "@/lib/marketing-content";

function config() {
  const baseUrl = process.env.WP_BASE_URL?.replace(/\/$/, "");
  const token = process.env.WP_API_TOKEN;
  if (!baseUrl || !token) {
    const missing = [!baseUrl ? "WP_BASE_URL" : "", !token ? "WP_API_TOKEN" : ""].filter(Boolean).join(",");
    throw new Error(`WORDPRESS_NOT_CONFIGURED:${missing}`);
  }
  return { baseUrl, token };
}

function validKey(value: string | null | undefined): value is MarketingContentKey {
  return Boolean(value && value in DEFAULT_MARKETING_CONTENT);
}

async function callWordPress(path: string, searchParams?: Record<string, string>, init?: RequestInit) {
  const { baseUrl, token } = config();
  const url = new URL(baseUrl);
  url.searchParams.set("rest_route", `/webly/v1${path}`);
  Object.entries(searchParams ?? {}).forEach(([key, value]) => url.searchParams.set(key, value));

  return fetch(url, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", "X-Webly-Token": token, ...(init?.headers ?? {}) },
  });
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  const status = request.nextUrl.searchParams.get("status") === "published" ? "published" : "draft";
  if (!validKey(key)) return NextResponse.json({ error: "Nieprawidłowy klucz treści." }, { status: 400 });
  try {
    const response = await callWordPress("/content", { key, status });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "WORDPRESS_UNAVAILABLE";
    return NextResponse.json({ error: message, content: DEFAULT_MARKETING_CONTENT[key] }, { status: 503 });
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json() as { key?: string; content?: unknown };
  if (!validKey(body.key) || !body.content) return NextResponse.json({ error: "Brakuje klucza lub treści." }, { status: 400 });
  try {
    const response = await callWordPress("/content", undefined, { method: "PUT", body: JSON.stringify({ key: body.key, content: body.content }) });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "WORDPRESS_UNAVAILABLE" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json() as { key?: string };
  if (!validKey(body.key)) return NextResponse.json({ error: "Nieprawidłowy klucz treści." }, { status: 400 });
  try {
    const response = await callWordPress("/publish", undefined, { method: "POST", body: JSON.stringify({ key: body.key }) });
    const data = await response.json();
    if (response.ok) {
      revalidatePath("/");
      revalidatePath("/oferta");
      revalidatePath("/szablony");
      revalidatePath("/cennik");
      revalidatePath("/kontakt");
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "WORDPRESS_UNAVAILABLE" }, { status: 503 });
  }
}
