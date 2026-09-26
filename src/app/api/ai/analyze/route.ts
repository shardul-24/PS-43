import { NextRequest, NextResponse } from 'next/server';
import { analyzeProblemDescription, detectDuplicatesAndSimilar } from '@/lib/aiEngine';
import { getChallenges } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, latitude, longitude, impactQuestions } = body;

    if (!title && !description) {
      return NextResponse.json(
        { success: false, message: 'Title or description required for AI analysis' },
        { status: 400 }
      );
    }

    const lat = latitude || 24.26;
    const lng = longitude || 87.24;

    const analysis = analyzeProblemDescription(title || '', description || '', category, {
      peopleAffectedApprox: impactQuestions?.peopleAffectedApprox || 500,
      immediateRisk: impactQuestions?.immediateRisk || false,
    });

    const existingChallenges = getChallenges();
    const similarMatches = detectDuplicatesAndSimilar(
      {
        title: title || '',
        description: description || '',
        category: analysis.category,
        latitude: lat,
        longitude: lng,
      },
      existingChallenges
    );

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        similarMatches,
      },
    });
  } catch (error) {
    console.error('AI Analyze API Error:', error);
    return NextResponse.json({ success: false, message: 'AI Analysis failed' }, { status: 500 });
  }
}
