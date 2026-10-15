import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Allow: /

# Google 广告爬虫（AdSense 审核与广告投放依赖它们抓取页面）
User-agent: Mediapartners-Google
Allow: /

User-agent: AdsBot-Google
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL));
};
