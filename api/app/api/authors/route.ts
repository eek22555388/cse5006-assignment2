import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { json, error, corsHeaders, logRequest } from '@/lib/api-helpers';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/authors        → all authors
// GET /api/authors?id=... → one author with their items
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (id) {
      const author = await prisma.author.findUnique({
        where: { id },
        include: {
          items: {
            where: { isActive: true },
            orderBy: { publishedAt: 'desc' },
          },
        },
      });

      if (!author) {
        await logRequest(req, 404);
        return error('Author not found', 404);
      }

      await logRequest(req, 200);
      return json(author);
    }

    const authors = await prisma.author.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { items: true } } },
    });

    await logRequest(req, 200);
    return json(authors);
  } catch (e) {
    console.error('GET /api/authors failed:', e);
    await logRequest(req, 500);
    return error('Server error', 500);
  }
}

// POST /api/authors
export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (!name) {
      await logRequest(req, 400);
      return error('name is required', 400);
    }

    const author = await prisma.author.create({
      data: { name, email: email ?? null },
    });

    await logRequest(req, 201);
    return json(author, 201);
  } catch (e: any) {
    if (e?.code === 'P2002') {
      await logRequest(req, 409);
      return error('An author with that email already exists', 409);
    }
    console.error('POST /api/authors failed:', e);
    await logRequest(req, 500);
    return error('Server error', 500);
  }
}

// PATCH /api/authors?id=...
export async function PATCH(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      await logRequest(req, 400);
      return error('id query parameter is required', 400);
    }

    const { name, email, isActive } = await req.json();

    const author = await prisma.author.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    await logRequest(req, 200);
    return json(author);
  } catch (e: any) {
    if (e?.code === 'P2025') {
      await logRequest(req, 404);
      return error('Author not found', 404);
    }
    if (e?.code === 'P2002') {
      await logRequest(req, 409);
      return error('An author with that email already exists', 409);
    }
    console.error('PATCH /api/authors failed:', e);
    await logRequest(req, 500);
    return error('Server error', 500);
  }
}

// DELETE /api/authors?id=...
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      await logRequest(req, 400);
      return error('id query parameter is required', 400);
    }

    const itemCount = await prisma.feedItem.count({ where: { authorId: id } });

    if (itemCount > 0) {
      await logRequest(req, 409);
      return error(
        `Cannot delete: this author has ${itemCount} item(s). Deactivate the author instead, or reassign their items.`,
        409
      );
    }

    await prisma.author.delete({ where: { id } });

    await logRequest(req, 204);
    return new Response(null, { status: 204, headers: corsHeaders });
  } catch (e: any) {
    if (e?.code === 'P2025') {
      await logRequest(req, 404);
      return error('Author not found', 404);
    }
    if (e?.code === 'P2003') {
      await logRequest(req, 409);
      return error('Cannot delete an author who still has items', 409);
    }
    console.error('DELETE /api/authors failed:', e);
    await logRequest(req, 500);
    return error('Server error', 500);
  }
}