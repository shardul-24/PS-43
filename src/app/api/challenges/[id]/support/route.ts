import { NextRequest, NextResponse } from 'next/server';
import { supportChallenge } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || `USR-${Date.now()}`;
    const userName = body.userName || 'Concerned Citizen';

    const updated = supportChallenge(id, userId, userName);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to support challenge' }, { status: 500 });
  }
}
