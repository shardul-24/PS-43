import { NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/db';

export async function GET() {
  try {
    const data = getAnalytics();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch analytics' }, { status: 500 });
  }
}
