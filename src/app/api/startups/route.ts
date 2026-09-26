import { NextRequest, NextResponse } from 'next/server';
import { getStartups, getProjectById } from '@/lib/db';
import { calculateStartupMatches } from '@/lib/aiEngine';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const startups = getStartups();

    if (projectId) {
      const project = getProjectById(projectId);
      if (project) {
        const matches = calculateStartupMatches(project, startups);
        return NextResponse.json({ success: true, count: matches.length, data: matches });
      }
    }

    return NextResponse.json({ success: true, count: startups.length, data: startups });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch startups' }, { status: 500 });
  }
}
