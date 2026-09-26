import { NextResponse } from 'next/server';
import { resetDatabase } from '@/lib/db';

export async function POST() {
  try {
    const data = resetDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database successfully restored to pristine Jharkhand SIH 2026 seed state.',
      challengesCount: data.challenges.length,
      projectsCount: data.projects.length,
    });
  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json({ success: false, message: 'Failed to reset database' }, { status: 500 });
  }
}
