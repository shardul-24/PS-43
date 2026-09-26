import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { milestoneId, progressPercent, status } = body;

    const project = getProjectById(id);
    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    const milestoneIndex = project.milestones.findIndex((m) => m.id === milestoneId);
    if (milestoneIndex === -1) {
      return NextResponse.json({ success: false, message: 'Milestone not found' }, { status: 404 });
    }

    project.milestones[milestoneIndex].progressPercent = progressPercent;
    project.milestones[milestoneIndex].status = status;
    if (status === 'COMPLETED' && !project.milestones[milestoneIndex].completedAt) {
      project.milestones[milestoneIndex].completedAt = new Date().toISOString().split('T')[0];
    }

    // Determine project stage based on milestones
    const allCompleted = project.milestones.every((m) => m.status === 'COMPLETED');
    const anyInProgress = project.milestones.some((m) => m.status === 'IN_PROGRESS' || m.progressPercent > 0);

    if (allCompleted) {
      project.stage = 'Completed';
    } else if (anyInProgress && project.stage === 'Proposal') {
      project.stage = 'Prototype';
    }

    const updated = updateProject(id, project);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update milestone' }, { status: 500 });
  }
}
