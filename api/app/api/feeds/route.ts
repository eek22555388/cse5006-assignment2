import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { json, error, corsHeaders, logRequest, slugify } from '@/lib/api-helpers';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/feeds        → all active feeds
// GET /api/feeds?id=... → one feed with its items
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (id) {
        const feed = await prisma.feed.findUnique({
        where: { id },
        include: {
          items: {
            where: {
              isActive: true,
              OR: [
                { authorId: null },
                { author: { isActive: true } },
              ],
            },
            orderBy: { publishedAt: 'desc' },
            include: { author: true },
          },
        },
      });

      if (!feed) {
        await logRequest(req, 404, id);
        return error('Feed not found', 404);
      }

      await logRequest(req, 200, id);
      return json(feed);
    }

    const feeds = await prisma.feed.findMany({
        
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { items: true } } },
    });

    await logRequest(req, 200);
    return json(feeds);
  } catch (e) {
    console.error('GET /api/feeds failed:', e);
    await logRequest(req, 500);
    return error('Server error', 500);
  }
}

// POST /api/feeds
export async function POST(req: NextRequest) {
  try {
    const { title, description, siteUrl } = await req.json();

    if (!title) {
      await logRequest(req, 400);
      return error('title is required', 400);
    }

    const slug = slugify(title);

    if (!slug) {
      await logRequest(req, 400);
      return error('title must contain at least one letter or number', 400);
    }

    const feed = await prisma.feed.create({
      data: { title, slug, description, siteUrl },
    });

    await logRequest(req, 201, feed.id);
    return json(feed, 201);
  } catch (e: any) {
    if (e?.code === 'P2002') {
      await logRequest(req, 409);
      return error('A feed with that title already exists', 409);
    }
    console.error('POST /api/feeds failed:', e);
    await logRequest(req, 500);
    return error('Server error', 500);
  }
}

// PATCH /api/feeds?id=...
export async function PATCH(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      await logRequest(req, 400);
      return error('id query parameter is required', 400);
    }

    const { title, slug, description, siteUrl } = await req.json();

    const feed = await prisma.feed.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(siteUrl !== undefined && { siteUrl }),
      },
    });

    await logRequest(req, 200, id);
    return json(feed);
  } catch (e: any) {
    if (e?.code === 'P2025') {
      await logRequest(req, 404);
      return error('Feed not found', 404);
    }
    console.error('PATCH /api/feeds failed:', e);
    await logRequest(req, 500);
    return error('Server error', 500);
  }
}

// DELETE /api/feeds?id=...
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      await logRequest(req, 400);
      return error('id query parameter is required', 400);
    }

    await prisma.feed.delete({ where: { id } });

    await logRequest(req, 204, id);
    return new Response(null, { status: 204, headers: corsHeaders });
  } catch (e: any) {
    if (e?.code === 'P2025') {
      await logRequest(req, 404);
      return error('Feed not found', 404);
    }
    console.error('DELETE /api/feeds failed:', e);
    await logRequest(req, 500);
    return error('Server error', 500);
  }
}