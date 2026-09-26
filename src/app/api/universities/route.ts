import { NextRequest, NextResponse } from 'next/server';
import { getUniversities, getChallengeById } from '@/lib/db';
import { calculateJharkhandFirstUniversityMatches } from '@/lib/aiEngine';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challengeId');
    const universities = getUniversities();

    if (challengeId) {
      const challenge = getChallengeById(challengeId);
      if (challenge) {
        const matches = calculateJharkhandFirstUniversityMatches(challenge, universities);
        return NextResponse.json({ success: true, count: matches.length, data: matches });
      }
    }

    return NextResponse.json({ success: true, count: universities.length, data: universities });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch universities' }, { status: 500 });
  }
}
