import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district') || undefined;
    const leaderboard = getLeaderboard(district);
    return NextResponse.json({ success: true, count: leaderboard.length, data: leaderboard });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
