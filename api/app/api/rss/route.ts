import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { corsHeaders, logRequest } from '@/lib/api-helpers';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// GET /api/rss?slug=cse5006-weekly-updates
export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('slug');

    if (!slug) {
      await logRequest(req, 400);
      return new Response('slug query parameter is required', {
        status: 400,
        headers: corsHeaders,
      });
    }

    const feed = await prisma.feed.findUnique({
      where: { slug },
      include: {
        items: {
          where: {
            isActive: true,
            OR: [{ authorId: null }, { author: { isActive: true } }],
          },
          orderBy: { publishedAt: 'desc' },
          take: 50,
          include: { author: true },
        },
      },
    });

    if (!feed) {
      await logRequest(req, 404);
      return new Response('Feed not found', {
        status: 404,
        headers: corsHeaders,
      });
    }

    const baseUrl = req.nextUrl.origin;

    const itemsXml = feed.items
      .map((item) => {
        const link = item.link ?? `${baseUrl}/api/items?id=${item.id}`;
        return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(item.guid)}</guid>
      <pubDate>${item.publishedAt.toUTCString()}</pubDate>
${item.summary ? `      <description>${escapeXml(item.summary)}</description>\n` : ''}${item.author ? `      <author>${escapeXml(item.author.name)}</author>\n` : ''}${item.category ? `      <category>${escapeXml(item.category)}</category>\n` : ''}${item.imageUrl ? `      <enclosure url="${escapeXml(item.imageUrl)}" type="image/jpeg" />\n` : ''}    </item>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(feed.title)}</title>
    <link>${escapeXml(feed.siteUrl ?? baseUrl)}</link>
    <description>${escapeXml(feed.description ?? feed.title)}</description>
    <lastBuildDate>${feed.updatedAt.toUTCString()}</lastBuildDate>
    <generator>CSE5006 RSS Server</generator>
${itemsXml}
  </channel>
</rss>`;

    await logRequest(req, 200, feed.id);

    return new Response(xml, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    });
  } catch (e) {
    console.error('GET /api/rss failed:', e);
    await logRequest(req, 500);
    return new Response('Server error', { status: 500, headers: corsHeaders });
  }
}