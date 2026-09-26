import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challengeId') || undefined;
    const logs = getAuditLogs(challengeId);
    return NextResponse.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch audit logs' }, { status: 500 });
  }
}
