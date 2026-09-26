import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject } from '@/lib/db';
import { IndustryCollaboration } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, startupId, startupName, types, contributionDetails, fundingCommittedInr } = body;

    if (!projectId || !startupId) {
      return NextResponse.json(
        { success: false, message: 'Project ID and Startup ID are required' },
        { status: 400 }
      );
    }

    const project = getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    const newCollab: IndustryCollaboration = {
      id: `COL-${Date.now().toString().slice(-4)}`,
      startupId,
      startupName: startupName || 'Industry Partner',
      types: types || ['Prototype Development', 'Testing & Certification'],
      contributionDetails: contributionDetails || 'Committed engineering resources and equipment.',
      fundingCommittedInr: fundingCommittedInr || 100000,
      status: 'ACTIVE',
      offeredAt: new Date().toISOString(),
      acceptedAt: new Date().toISOString(),
    };

    project.collaborations.unshift(newCollab);
    const updated = updateProject(projectId, project);

    return NextResponse.json({ success: true, data: updated }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to offer collaboration' }, { status: 500 });
  }
}
