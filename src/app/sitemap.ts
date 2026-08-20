import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const routes = ["", "/solution", "/about", "/research", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://farmilytechnologies.com${route}`,
    lastModified: new Date(),
  }));
}
