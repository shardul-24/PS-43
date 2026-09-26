import { NextRequest, NextResponse } from 'next/server';
import { getChallenges, createChallenge, getUniversities } from '@/lib/db';
import {
  analyzeProblemDescription,
  detectDuplicatesAndSimilar,
  calculateExplainablePriority,
  calculateJharkhandFirstUniversityMatches,
} from '@/lib/aiEngine';
import { Challenge, ChallengeCategory } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district') || undefined;
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const search = searchParams.get('search') || undefined;

    const challenges = getChallenges({ district, category, status, priority, search });
    return NextResponse.json({ success: true, count: challenges.length, data: challenges });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch challenges' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      subcategory,
      district,
      block,
      villageOrCity,
      latitude,
      longitude,
      submittedBy,
      evidence = [],
      impactQuestions,
    } = body;

    if (!title || !description || !district) {
      return NextResponse.json(
        { success: false, message: 'Title, description, and district are required.' },
        { status: 400 }
      );
    }

    const lat = latitude || 23.5;
    const lng = longitude || 85.3;

    // Run AI problem understanding
    const aiAnalysis = analyzeProblemDescription(title, description, category, {
      peopleAffectedApprox: impactQuestions?.peopleAffectedApprox || 500,
      immediateRisk: impactQuestions?.immediateRisk || false,
    });

    // Check for duplicates/similar challenges
    const existing = getChallenges();
    const similarChallenges = detectDuplicatesAndSimilar(
      { title, description, category: aiAnalysis.category, latitude: lat, longitude: lng },
      existing
    );

    // Calculate priority breakdown
    const priority = calculateExplainablePriority({
      peopleAffectedApprox: impactQuestions?.peopleAffectedApprox || 500,
      immediateRisk: impactQuestions?.immediateRisk || false,
      frequency: impactQuestions?.frequency || 'Continuous',
      durationMonths: impactQuestions?.durationMonths || 3,
      supportersCount: 1,
      originalReportsCount: 1,
    });

    const newId = `CH-${Date.now().toString().slice(-4)}`;

    const newChallenge: Challenge = {
      id: newId,
      title,
      description,
      category: aiAnalysis.category,
      subcategory: subcategory || aiAnalysis.subcategory,
      district,
      block: block || 'General Block',
      villageOrCity: villageOrCity || district,
      latitude: lat,
      longitude: lng,
      submittedBy: submittedBy || {
        id: `USR-${Date.now()}`,
        name: 'Citizen Contributor',
        district,
        isAnonymous: false,
      },
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
      priority,
      aiAnalysis,
      similarChallenges,
      communitySupport: {
        originalReportsCount: 1,
        supportersCount: 1,
        followersCount: 1,
        evidenceContributorsCount: evidence.length,
        hasUserSupported: true,
      },
      evidence: evidence.map((e: any, idx: number) => ({
        id: `EVD-${Date.now()}-${idx}`,
        type: e.type || 'image',
        url: e.url || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
        caption: e.caption || 'Citizen uploaded evidence',
        uploadedAt: new Date().toISOString(),
        uploadedBy: submittedBy?.name || 'Citizen',
      })),
      impactQuestions: impactQuestions || {
        peopleAffectedApprox: 500,
        frequency: 'Continuous',
        durationMonths: 3,
        immediateRisk: false,
        affectsPublicServices: true,
      },
      updatedAt: new Date().toISOString(),
    };

    // Calculate initial university matches
    const allUniversities = getUniversities();
    newChallenge.matchedUniversities = calculateJharkhandFirstUniversityMatches(newChallenge, allUniversities);

    const saved = createChallenge(newChallenge);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create challenge' }, { status: 500 });
  }
}
