import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://webly-platform-sigma.vercel.app";
  return ["", "/oferta", "/szablony", "/cennik", "/kontakt"].map((path, index) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.8,
  }));
}

