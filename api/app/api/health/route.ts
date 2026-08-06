import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { corsHeaders } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: 'ok',
        database: 'connected',
        latencyMs: Date.now() - startedAt,
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    console.error('Healthcheck failed:', e);
    return NextResponse.json(
      {
        status: 'error',
        database: 'unreachable',
        timestamp: new Date().toISOString(),
      },
      { status: 503, headers: corsHeaders }
    );
  }
}