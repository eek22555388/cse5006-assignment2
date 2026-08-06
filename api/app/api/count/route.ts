import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { json, error, corsHeaders } from '@/lib/api-helpers';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  try {
    const since = new Date(Date.now() - 60 * 60 * 1000);

    const [
      totalRequests,
      requestsLastHour,
      uniqueClients,
      feedCount,
      itemCount,
      activeItemCount,
      authorCount,
      byPath,
      byStatus,
      byFeed,
    ] = await Promise.all([
      prisma.requestLog.count(),
      prisma.requestLog.count({ where: { createdAt: { gte: since } } }),
      prisma.requestLog.findMany({
        distinct: ['clientIp'],
        select: { clientIp: true },
      }),
      prisma.feed.count(),
      prisma.feedItem.count(),
      prisma.feedItem.count({ where: { isActive: true } }),
      prisma.author.count(),
      prisma.requestLog.groupBy({
        by: ['path'],
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
      }),
      prisma.requestLog.groupBy({
        by: ['statusCode'],
        _count: { statusCode: true },
      }),
      prisma.requestLog.groupBy({
        by: ['feedId'],
        _count: { feedId: true },
        where: { feedId: { not: null } },
      }),
    ]);

    return json({
      requests: {
        total: totalRequests,
        lastHour: requestsLastHour,
        uniqueClients: uniqueClients.filter((c) => c.clientIp !== null).length,
        byPath: byPath.map((r) => ({ path: r.path, count: r._count.path })),
        byStatus: byStatus.map((r) => ({
          status: r.statusCode,
          count: r._count.statusCode,
        })),
        byFeed: byFeed.map((r) => ({ feedId: r.feedId, count: r._count.feedId })),
      },
      content: {
        feeds: feedCount,
        items: itemCount,
        activeItems: activeItemCount,
        inactiveItems: itemCount - activeItemCount,
        authors: authorCount,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error('GET /api/count failed:', e);
    return error('Server error', 500);
  }
}