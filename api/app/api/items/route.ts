import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { json, error, corsHeaders, logRequest } from '@/lib/api-helpers';
import { randomUUID } from 'crypto';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/items            → all active items
// GET /api/items?id=...     → one item
// GET /api/items?feedId=... → items in a feed
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const feedId = req.nextUrl.searchParams.get('feedId');

    if (id) {
      const item = await prisma.feedItem.findUnique({
        where: { id },
        include: { author: true, feed: true },
      });

      if (!item) {
        await logRequest(req, 404);
        return error('Item not found', 404);
      }

      await logRequest(req, 200, item.feedId);
      return json(item);
    }

    const items = await prisma.feedItem.findMany({
      where: {
        isActive: true,
        ...(feedId && { feedId }),
      },
      orderBy: { publishedAt: 'desc' },
      include: { author: true, feed: { select: { title: true, slug: true } } },
    });

    await logRequest(req, 200, feedId);
    return json(items);
  } catch (e) {
    console.error('GET /api/items failed:', e);
    await logRequest(req, 500);
    return error('Server error', 500);
  }
}

// POST /api/items
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { feedId, title, summary, content, link, imageUrl, category, authorId, publishedAt } = body;

    if (!feedId || !title) {
      await logRequest(req, 400);
      return error('feedId and title are required', 400);
    }

    const feed = await prisma.feed.findUnique({ where: { id: feedId } });
    if (!feed) {
      await logRequest(req, 404, feedId);
      return error('Feed not found', 404);
    }

    if (authorId) {
      const author = await prisma.author.findUnique({ where: { id: authorId } });
      if (!author) {
        await logRequest(req, 404, feedId);
        return error('Author not found', 404);
      }
    }

    const item = await prisma.feedItem.create({
      data: {
        guid: body.guid ?? randomUUID(),
        feedId,
        title,
        summary,
        content,
        link,
        imageUrl,
        category,
        authorId: authorId ?? null,
        ...(publishedAt && { publishedAt: new Date(publishedAt) }),
      },
      include: { author: true },
    });

    await logRequest(req, 201, feedId);
    return json(item, 201);
  } catch (e: any) {
    if (e?.code === 'P2002') {
      await logRequest(req, 409);
      return error('An item with that guid already exists', 409);
    }
    console.error('POST /api/items failed:', e);
    await logRequest(req, 500);
    return error('Server error', 500);
  }
}