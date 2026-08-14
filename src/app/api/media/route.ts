import { NextResponse } from "next/server";
import { getCustomerMedia, uploadCustomerMedia } from "@/lib/customer-data";
import { getCustomerSession } from "@/lib/customer-session";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function GET() {
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: "Zaloguj się ponownie." }, { status: 401 });
  try { return NextResponse.json({ media: await getCustomerMedia(customer.id) }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się pobrać biblioteki." }, { status: 500 }); }
}

export async function POST(request: Request) {
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ error: "Zaloguj się ponownie." }, { status: 401 });
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || !allowedTypes.has(file.type)) return NextResponse.json({ error: "Wybierz plik JPG, PNG, WEBP lub GIF." }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: "Zdjęcie może mieć maksymalnie 4 MB." }, { status: 400 });
  try {
    const data = Buffer.from(await file.arrayBuffer()).toString("base64");
    const asset = await uploadCustomerMedia({ customerId: customer.id, fileName: file.name, mimeType: file.type, data });
    return NextResponse.json({ asset });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Nie udało się wysłać zdjęcia." }, { status: 500 }); }
}
