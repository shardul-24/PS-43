import { NextRequest, NextResponse } from 'next/server';
import { getProjects, createProject, getChallengeById } from '@/lib/db';
import { Project } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district') || undefined;
    const stage = searchParams.get('stage') || undefined;
    const universityId = searchParams.get('universityId') || undefined;

    const projects = getProjects({ district, stage, universityId });
    return NextResponse.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      challengeId,
      title,
      universityId,
      universityName,
      facultyMentor,
      students = [],
      proposal,
      district,
    } = body;

    if (!challengeId || !title || !universityId) {
      return NextResponse.json(
        { success: false, message: 'Challenge ID, title, and university are required.' },
        { status: 400 }
      );
    }

    const challenge = getChallengeById(challengeId);
    const challengeTitle = challenge?.title || 'Grassroots Societal Challenge';
    const projectDistrict = district || challenge?.district || 'Ranchi';

    const newProject: Project = {
      id: `PRJ-${Date.now().toString().slice(-4)}`,
      challengeId,
      challengeTitle,
      title,
      district: projectDistrict,
      universityId,
      universityName: universityName || 'Jharkhand University',
      facultyMentor: facultyMentor || {
        id: `FAC-${Date.now()}`,
        name: 'Dr. Faculty Mentor',
        department: 'Engineering & Innovation',
        designation: 'Professor',
        email: 'mentor@univ.ac.in',
        specializations: ['Appropriate Technology'],
        patentsCount: 1,
        completedProjectsCount: 4,
      },
      students: students.length > 0 ? students : [
        { name: 'Aakash Kumar', department: 'Computer Engineering', year: 'Final Year', roleInProject: 'Systems Architecture' },
        { name: 'Simran Minz', department: 'Environmental Science', year: '3rd Year', roleInProject: 'Field Testing' },
      ],
      proposal: proposal || {
        problemUnderstanding: 'Grassroots community problem requiring technological and engineering intervention.',
        proposedSolution: title,
        technologyStack: ['IoT', 'Solar Power', 'Data Analytics'],
        expectedImpact: 'Direct relief and measurable benefit to affected community.',
        estimatedCostInr: 250000,
        timelineMonths: 4,
        prototypeDescription: 'Functional prototype under rapid assembly.',
        submittedAt: new Date().toISOString(),
        approvedByGovernment: true,
        approvedAt: new Date().toISOString(),
      },
      stage: 'Proposal',
      milestones: [
        {
          id: `M-01-${Date.now()}`,
          title: 'Problem Validation & Baseline Community Survey',
          description: 'Engage with local Panchayat and collect baseline ground samples and interviews.',
          progressPercent: 100,
          status: 'COMPLETED',
          deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          completedAt: new Date().toISOString().split('T')[0],
          responsibleLead: students[0]?.name || 'Student Lead',
          deliverables: ['Baseline Community Survey Report'],
        },
        {
          id: `M-02-${Date.now()}`,
          title: 'Benchtop Prototype Assembly & Laboratory Testing',
          description: 'Build functional engineering prototype and test parameters in university laboratory.',
          progressPercent: 65,
          status: 'IN_PROGRESS',
          deadline: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
          responsibleLead: facultyMentor?.name || 'Faculty Mentor',
          deliverables: ['Laboratory Validation Certificate'],
        },
        {
          id: `M-03-${Date.now()}`,
          title: 'Field Pilot Deployment in Affected Village',
          description: 'Deploy hardware and train community operators for continuous operation.',
          progressPercent: 0,
          status: 'PENDING',
          deadline: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
          responsibleLead: 'Team Lead',
        },
      ],
      collaborations: [],
      impactMetrics: {
        peopleBenefited: challenge?.impactQuestions?.peopleAffectedApprox || 800,
        villagesCovered: 2,
        costSavedInr: 200000,
        beforeCondition: 'High contamination, distress, and health risks.',
        afterCondition: 'Remediated infrastructure and restored community safety.',
        impactScore: 85,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = createProject(newProject);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create project' }, { status: 500 });
  }
}
