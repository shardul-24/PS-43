import { NextRequest, NextResponse } from 'next/server';
import { getChallengeById, updateChallenge, getUniversities } from '@/lib/db';
import { calculateJharkhandFirstUniversityMatches } from '@/lib/aiEngine';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const challenge = getChallengeById(id);
    if (!challenge) {
      return NextResponse.json({ success: false, message: 'Challenge not found' }, { status: 404 });
    }

    // Refresh university matches dynamically
    if (!challenge.matchedUniversities || challenge.matchedUniversities.length === 0) {
      const universities = getUniversities();
      challenge.matchedUniversities = calculateJharkhandFirstUniversityMatches(challenge, universities);
    }

    return NextResponse.json({ success: true, data: challenge });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch challenge' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, assignedDepartment, assignedUniversityId, assignedUniversityName, actor } = body;

    const updates: any = {};
    if (status) updates.status = status;
    if (assignedDepartment) updates.assignedDepartment = assignedDepartment;
    if (assignedUniversityId) {
      updates.assignedUniversityId = assignedUniversityId;
      updates.assignedUniversityName = assignedUniversityName;
    }

    const updated = updateChallenge(id, updates, actor);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update challenge' }, { status: 500 });
  }
}
