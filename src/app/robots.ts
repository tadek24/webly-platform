import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://webly-platform-sigma.vercel.app";
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/panel/"] }], sitemap: `${baseUrl}/sitemap.xml` };
}

