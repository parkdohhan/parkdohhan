import type { MetadataRoute } from 'next';

const BASE = 'https://www.parkdohhan.com';
const PATHS = ['/', '/works/', '/works/the-etched-mutation/', '/writing/', '/video/', '/about/'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((p) => ({ url: BASE + p }));
}
