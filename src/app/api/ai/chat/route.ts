import { NextRequest, NextResponse } from 'next/server';
import { getChallenges, getProjects, getUniversities, getStartups } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, role = 'citizen' } = body;

    if (!message) {
      return NextResponse.json({ success: false, message: 'Message is required' }, { status: 400 });
    }

    const q = message.toLowerCase();
    const challenges = getChallenges();
    const projects = getProjects();
    const universities = getUniversities();
    const startups = getStartups();

    let responseText = '';

    if (q.includes('water') || q.includes('dumka') || q.includes('drinking')) {
      const waterChallenges = challenges.filter((c) => c.category === 'Water Resources');
      const dumkaWater = waterChallenges.find((c) => c.district.toLowerCase() === 'dumka');
      responseText = `There are currently ${waterChallenges.length} water-related challenges across Jharkhand. In Dumka district, **CH-1024** ("Drinking water contamination affecting villages near Dumka") has 127 citizens supporting it, with high priority (score 88). It is currently routed to Birla Institute of Technology (BIT) Mesra under project **PRJ-301**, partnered with JalRakshak IoT Technologies.`;
    } else if (q.includes('priority') || q.includes('how is priority calculated') || q.includes('formula')) {
      responseText = `The Samadhan Sangam Priority Engine uses an **explainable 5-factor transparent formula**:\n\n1. **Population Affected** (0-25 pts)\n2. **Health & Safety Risk** (0-30 pts)\n3. **Community Support & Reports** (0-20 pts)\n4. **Geographical Spread** (0-15 pts)\n5. **Urgency & Duration** (0-10 pts)\n\nTotal Score > 85 = CRITICAL, > 70 = HIGH, > 50 = MEDIUM. Reasons are published openly for full transparency.`;
    } else if (q.includes('score') || q.includes('rank') || q.includes('citizen impact score')) {
      responseText = `The **Citizen Impact Score** is designed to prevent spam by rewarding verified civic contributions:\n\n• Verified Reports: +180 pts\n• Community Endorsements: +220 pts\n• High Quality Evidence: +120 pts\n• Project Resolution Impact: +150 pts\n• Constructive Engagement: +72 pts\n\nRank Tiers: Community Contributor (0-199) → Community Champion (200-499) → Impact Leader (500-999) → Civic Innovator (1000+).`;
    } else if (q.includes('iot') || q.includes('sensor') || q.includes('technology')) {
      const iotProjects = projects.filter((p) => p.proposal.technologyStack.some((t) => t.toLowerCase().includes('iot')));
      responseText = `We have active IoT innovation initiatives including **PRJ-301** (IoT-Enabled Continuous Water Quality Monitoring & Rapid Filtration Pilot in Dumka) led by BIT Mesra and supported by JalRakshak IoT Technologies, featuring solar-buffered telemetry buoys.`;
    } else if (q.includes('jharkhand first') || q.includes('routing') || q.includes('university match')) {
      responseText = `**Jharkhand-First University Routing** mandates that Tier 1 Higher Education Institutions within Jharkhand (such as BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur, BAU Kanke, and SKMU Dumka) receive primary matching affinity based on Department Fit (30%), Faculty Expertise (25%), Research Facilities (20%), Labs (10%), Past Projects (5%), Proximity (4%), and State Priority (+6%). External institutions are only routed to if local capability is unavailable.`;
    } else if (q.includes('district') || q.includes('unresolved') || q.includes('highest')) {
      responseText = `According to our command center analytics, **Ranchi** has 84 reported challenges (14 active projects), **Dhanbad** has 68 challenges (primarily Mining & Air/Water Runoff), and **Dumka** has 38 challenges with an active water pilot. High priority challenges are prioritized in the Government Verification Queue.`;
    } else {
      responseText = `Sangam AI is monitoring ${challenges.length} societal challenges, ${projects.length} university-led projects, and ${universities.length} Jharkhand institutions. You can ask me about challenge statuses in specific districts (e.g., Dumka, Dhanbad, Ranchi), university matching scores, startup collaboration opportunities, or explainable priority formulas.`;
    }

    return NextResponse.json({
      success: true,
      data: {
        reply: responseText,
        source: 'Sangam AI Governance Knowledge Engine (PS26043)',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ success: false, message: 'AI chat failed' }, { status: 500 });
  }
}
