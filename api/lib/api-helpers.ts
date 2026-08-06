import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders });
}

export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: corsHeaders });
}

export async function logRequest(
  req: NextRequest,
  statusCode: number,
  feedId?: string | null
) {
  try {
    await prisma.requestLog.create({
      data: {
        path: req.nextUrl.pathname,
        method: req.method,
        clientIp:
          req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? null,
        userAgent: req.headers.get('user-agent') ?? null,
        feedId: feedId ?? null,
        statusCode,
      },
    });
  } catch (e) {
    console.error('Failed to log request:', e);
  }
}