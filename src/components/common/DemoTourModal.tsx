'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  Play,
  Flame,
} from 'lucide-react';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StepInfo {
  number: number;
  title: string;
  role: 'Citizen' | 'AI' | 'Government' | 'University' | 'Startup' | 'Impact';
  roleIcon: any;
  roleColor: string;
  summary: string;
  keyDetails: string[];
  actionLink: string;
  actionButtonText: string;
}

const TOUR_STEPS: StepInfo[] = [
  {
    number: 1,
    title: 'Citizen Reports Grassroots Problem',
    role: 'Citizen',
    roleIcon: Users,
    roleColor: 'text-blue-600 bg-blue-50 border-blue-200',
    summary: 'Rameshwar Tudu from Shikaripara, Dumka opens the multi-step reporting wizard and writes: "Drinking water supplied to our village has a bad smell and residents are worried about contamination."',
    keyDetails: [
      'Submits geolocation (Dumka: 24.26° N, 87.24° E)',
      'Uploads field evidence photo of yellowish contaminated tap water',
      'Reports 1,240 people affected with active gastrointestinal and fluorosis risk',
    ],
    actionLink: '/citizen/report',
    actionButtonText: 'Open Citizen Report Wizard',
  },
  {
    number: 2,
    title: 'AI Problem Understanding & Structured Extraction',
    role: 'AI',
    roleIcon: Sparkles,
    roleColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    summary: 'Sangam AI parses natural language into structured JSON, determining category: Water Resources, affected domain: Public Health, and estimated priority: HIGH with 94% confidence.',
    keyDetails: [
      'Identifies domain: Public Health & Rural Safe Drinking Water',
      'Recommends expertise: Environmental Engineering, Water Toxicology, IoT Telemetry',
      'Calculates initial priority score: 88/100',
    ],
    actionLink: '/challenges/CH-1024',
    actionButtonText: 'View AI Structured Analysis',
  },
  {
    number: 3,
    title: 'Duplicate & Similarity Interception',
    role: 'AI',
    roleIcon: Layers,
    roleColor: 'text-purple-600 bg-purple-50 border-purple-200',
    summary: 'Before submission completes, the system intercepts with "3 Similar Challenges Found" (92% similarity in Masalia, 8.4 km away with 127 citizens supporting).',
    keyDetails: [
      'Prevents duplicate fragmentation without suppressing citizen voices',
      'Offers citizen choices: [Support Existing] or [Report as Separate] or [Add Evidence]',
      'Aggregates 127 citizens into unified community evidence weight',
    ],
    actionLink: '/citizen/report',
    actionButtonText: 'Test Duplicate Interceptor',
  },
  {
    number: 4,
    title: 'Citizen Impact Score & Anti-Spam Ranking',
    role: 'Citizen',
    roleIcon: Users,
    roleColor: 'text-blue-600 bg-blue-50 border-blue-200',
    summary: 'Rameshwar Tudu’s score updates based on verified contributions, evidence quality, and community support (+180 verified, +220 support, +120 evidence) reaching 842 points (Civic Innovator).',
    keyDetails: [
      'Separates citizen contribution ranking from problem urgency priority',
      'Anti-spam: Only verified community impact awards points',
      'Leaderboard highlights grassroots champions across all 24 districts',
    ],
    actionLink: '/citizen/leaderboard',
    actionButtonText: 'View Citizen Leaderboard',
  },
  {
    number: 5,
    title: 'Government Command Center & Verification Queue',
    role: 'Government',
    roleIcon: Building2,
    roleColor: 'text-amber-600 bg-amber-50 border-amber-200',
    summary: 'Department of Higher & Technical Education officer reviews CH-1024 at top of the verification queue with transparent 5-factor priority score (88/100).',
    keyDetails: [
      'Interactive 24-district density map highlights Dumka water cluster',
      'Officer inspects evidence photos and AI confidence',
      'Clicks "Verify Challenge" — creating immutable audit trail entry',
    ],
    actionLink: '/government',
    actionButtonText: 'Open Government Command Center',
  },
  {
    number: 6,
    title: 'Jharkhand-First University Routing',
    role: 'Government',
    roleIcon: GraduationCap,
    roleColor: 'text-teal-600 bg-teal-50 border-teal-200',
    summary: 'The algorithm enforces "Jharkhand-First" Tier 1 HEI routing. It ranks BIT Mesra as #1 match (94%) with explainable 6-factor breakdown.',
    keyDetails: [
      'Dept Fit (30%), Faculty Dr. Priya Sharma (25%), Water Testing Lab (10%), Tier 1 State Priority (+6%)',
      'SKMU Dumka ranked #2 (89%) for geographic proximity',
      'Government officer clicks "Route to BIT Mesra"',
    ],
    actionLink: '/government',
    actionButtonText: 'Inspect University Routing Algorithm',
  },
  {
    number: 7,
    title: 'University Accepts & Forms Multidisciplinary Team',
    role: 'University',
    roleIcon: GraduationCap,
    roleColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    summary: 'BIT Mesra Department of Environmental Engineering receives routed challenge, clicks "Accept Challenge", and creates a 4-department student & faculty squad.',
    keyDetails: [
      'Faculty Mentor: Dr. Priya Sharma (3 water filter patents)',
      'Cross-department students: Environmental + Computer Science (IoT) + Civil + Electronics',
      'Combines diverse academic capabilities into applied civic innovation',
    ],
    actionLink: '/university',
    actionButtonText: 'Open University Innovation Portal',
  },
  {
    number: 8,
    title: 'Solution Proposal Submission',
    role: 'University',
    roleIcon: GraduationCap,
    roleColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    summary: 'The team submits proposal PRJ-301: "IoT-Enabled Continuous Water Quality Monitoring & Rapid Filtration Pilot" with estimated budget of ₹2.85 Lakhs.',
    keyDetails: [
      'Detailed tech stack: ESP32, Optical Turbidity & Fluoride probes, LoRaWAN, Moringa biosorption',
      'Expected outcome: 10,000 L/day safe potable water (<1.0 ppm fluoride)',
      'Government approves proposal for rapid pilot execution',
    ],
    actionLink: '/projects/PRJ-301',
    actionButtonText: 'View Solution Proposal',
  },
  {
    number: 9,
    title: 'Startup Discovers & Pledges Collaboration',
    role: 'Startup',
    roleIcon: Briefcase,
    roleColor: 'text-purple-600 bg-purple-50 border-purple-200',
    summary: 'Ranchi-based startup "JalRakshak IoT Technologies" discovers project PRJ-301 matching its capabilities (91% match) and pledges prototype hardware & funding.',
    keyDetails: [
      'Pledges 4 commercial optical probe housings + free 2-year telemetry SIMs',
      'Contributes ₹1.5 Lakhs matching grant for kiosk fabrication',
      'University and Government accept industry collaboration',
    ],
    actionLink: '/startup',
    actionButtonText: 'Open Startup & Industry Hub',
  },
  {
    number: 10,
    title: 'Project Enters Milestone Execution',
    role: 'University',
    roleIcon: Layers,
    roleColor: 'text-sky-600 bg-sky-50 border-sky-200',
    summary: 'The project moves through the 9-stage lifecycle: Aquifer Sampling (100%), IoT Sensor Prototyping (100%), and Pilot Kiosk Installation (75%).',
    keyDetails: [
      'Verifiable deliverables attached to each milestone (Chemical reports, firmware code)',
      'Live milestone progress updates transparently in real time',
      'Stage transitions from Prototype to Pilot Deployment',
    ],
    actionLink: '/projects/PRJ-301',
    actionButtonText: 'Track Project Milestones',
  },
  {
    number: 11,
    title: 'Government Monitors Live Pilot in Dumka',
    role: 'Government',
    roleIcon: Building2,
    roleColor: 'text-amber-600 bg-amber-50 border-amber-200',
    summary: 'On the Government Command Center, the status updates to "Project in Pilot". Officer monitors deployment milestones, budget utilization, and sensor telemetry.',
    keyDetails: [
      'Telemetry verifies safe TDS (180 ppm) and low fluoride (0.8 mg/L)',
      'Dumka District Collectorate confirms operational community kiosk',
      'Zero manual paperwork friction',
    ],
    actionLink: '/government',
    actionButtonText: 'View Government Pilot Monitor',
  },
  {
    number: 12,
    title: 'Measurable Social Impact Validated',
    role: 'Impact',
    roleIcon: Sparkles,
    roleColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
    summary: 'The outcome registers on public & citizen dashboards: 1,050+ citizens benefited, 85% drop in waterborne gastrointestinal illnesses, and 2.5 hours saved daily per household!',
    keyDetails: [
      'Pre vs Post condition: From foul 4.2 mg/L fluoride to certified safe drinking water',
      'Rameshwar Tudu and 127 supporters receive notification of resolved challenge',
      'Full cycle completed: Citizen → AI → Govt → University → Startup → Social Impact',
    ],
    actionLink: '/projects/PRJ-301',
    actionButtonText: 'View Social Impact Metrics',
  },
];

export function DemoTourModal({ isOpen, onClose }: DemoTourModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const Icon = currentStep.roleIcon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B192C] text-white">
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  SIH 2026 Judge Demonstration Guide
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                  Step {currentStep.number} of 12
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {currentStep.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progression Indicators */}
        <div className="my-4 flex items-center gap-1 overflow-x-auto pb-1">
          {TOUR_STEPS.map((s, idx) => (
            <button
              key={s.number}
              onClick={() => setCurrentStepIndex(idx)}
              className={`flex h-7 items-center justify-center rounded-md px-2 text-xs font-bold transition shrink-0 ${
                idx === currentStepIndex
                  ? 'bg-[#0B192C] text-white shadow-xs'
                  : idx < currentStepIndex
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {idx < currentStepIndex ? <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600 inline" /> : null}
              {s.number}
            </button>
          ))}
        </div>

        {/* Step Body */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 my-3">
          <div className="flex items-center justify-between mb-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${currentStep.roleColor}`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>Role: {currentStep.role}</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Demo Scenario: Dumka Water Contamination
            </span>
          </div>

          <p className="text-sm font-medium text-slate-800 leading-relaxed">
            {currentStep.summary}
          </p>

          <div className="mt-3 space-y-1.5 border-t border-slate-200/60 pt-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Key Mechanism Demonstrated:
            </span>
            {currentStep.keyDetails.map((detail, dIdx) => (
              <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <button
              disabled={currentStepIndex === TOUR_STEPS.length - 1}
              onClick={() => setCurrentStepIndex((prev) => Math.min(TOUR_STEPS.length - 1, prev + 1))}
              className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Link
            href={currentStep.actionLink}
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg bg-[#0B192C] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#1E3E62] transition"
          >
            <span>{currentStep.actionButtonText}</span>
            <ArrowRight className="h-4 w-4 text-emerald-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
