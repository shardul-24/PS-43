'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Users,
  Award,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Briefcase,
  Plus,
  Send,
  Building,
  X,
  ExternalLink,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Activity,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  Paperclip,
  FileCheck2,
  Trash2,
  Globe,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Challenge, Project } from '@/types';

export default function UniversityPortal() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'assigned' | 'projects' | 'teamBuilder'>('assigned');
  const [selectedChallengeForTeam, setSelectedChallengeForTeam] = useState<Challenge | null>(null);
  const [inspectingChallenge, setInspectingChallenge] = useState<Challenge | null>(null);

  // Team Builder State
  const [mentorName, setMentorName] = useState('Dr. Priya Sharma');
  const [mentorDept, setMentorDept] = useState('Environmental Engineering');
  const [solutionTitle, setSolutionTitle] = useState('IoT-Enabled Water Quality Telemetry & Biosorption Pilot');
  const [solutionCost, setSolutionCost] = useState(285000);
  const [solutionDuration, setSolutionDuration] = useState(4);
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [proposalSubmittedSuccess, setProposalSubmittedSuccess] = useState(false);

  // Student Members
  const [students, setStudents] = useState([
    {
      name: 'Ananya Verma',
      department: 'Computer Science & Engineering',
      year: 'Final Year B.Tech',
      roleInProject: 'IoT Firmware & Cloud Lead',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      email: 'ananya.verma@bitmesra.ac.in',
    },
    {
      name: 'Rohan Soren',
      department: 'Environmental Engineering',
      year: '3rd Year B.Tech',
      roleInProject: 'Water Sampling & Biosorption Filter Testing',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      email: 'rohan.soren@bitmesra.ac.in',
    },
    {
      name: 'Aditya Raj',
      department: 'Civil Engineering',
      year: 'Final Year B.Tech',
      roleInProject: 'Rural Cistern Hydraulics & Piping',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      email: 'aditya.raj@bitmesra.ac.in',
    },
    {
      name: 'Kavita Kumari',
      department: 'Electronics & Communication',
      year: '3rd Year B.Tech',
      roleInProject: 'Low-power LoRaWAN Node Assembly',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
      email: 'kavita.kumari@bitmesra.ac.in',
    },
  ]);
  const [expandedStudents, setExpandedStudents] = useState<number[]>([]);

  // Mandatory Solution Proposal Inputs
  const [solutionDescription, setSolutionDescription] = useState(
    'Our multidisciplinary solution combines a solar-buffered multi-probe telemetry station with a locally deployable Moringa oleifera biosorption column. Low-cost optical sensors continuously measure fluoride, turbidity, and TDS at community intake points in Dumka hamlets, sending alerts via LoRaWAN to village water committees. Biosorption gravity filtration columns provide safe potable water (<1.0 ppm fluoride) adhering to BIS 10500 standards.'
  );
  const [pptFileName, setPptFileName] = useState<string>('BIT_Mesra_Water_Biosorption_Pilot_Deck_v1.pptx');
  const [pptFileSize, setPptFileSize] = useState<string>('3.8 MB');
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleStudentCard = (idx: number) => {
    setExpandedStudents((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handlePptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPptFileName(file.name);
      setPptFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setValidationError(null);
    }
  };

  const handleRemovePpt = () => {
    setPptFileName('');
    setPptFileSize('');
  };

  const handlePreloadDemoPpt = () => {
    setPptFileName('BIT_Mesra_Water_Biosorption_Pilot_Deck_v1.pptx');
    setPptFileSize('3.8 MB');
    setValidationError(null);
  };

  const loadData = () => {
    fetch('/api/challenges?status=All')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setChallenges(json.data);
          const dumka = json.data.find((c: Challenge) => c.id === 'CH-1024');
          if (dumka) setSelectedChallengeForTeam(dumka);
        }
      })
      .catch(() => {});

    fetch('/api/projects')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setProjects(json.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  // Action: Accept Challenge
  const handleAcceptChallenge = async (ch: Challenge) => {
    try {
      const res = await fetch(`/api/challenges/${ch.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Accepted',
          assignedUniversityId: 'UNIV-JH-01',
          assignedUniversityName: 'Birla Institute of Technology, Mesra',
          actor: {
            role: 'university',
            name: 'Dr. Priya Sharma (BIT Mesra)',
            actionDescription: 'BIT Mesra Department of Environmental Engineering accepted challenge.',
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedChallengeForTeam(data.data);
        setActiveTab('teamBuilder');
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Action: Submit Multidisciplinary Team Proposal
  const handleSubmitTeamProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!selectedChallengeForTeam) {
      setValidationError('Please select an accepted challenge to bind your proposal.');
      return;
    }

    if (!solutionTitle.trim()) {
      setValidationError('Project / Solution Title is required.');
      return;
    }

    if (!solutionDescription.trim() || solutionDescription.trim().length < 30) {
      setValidationError('Detailed description about the proposed solution is mandatory (minimum 30 characters).');
      return;
    }

    if (!pptFileName) {
      setValidationError('Solution Presentation Deck (PPT/PPTX/PDF) is mandatory for state funding committee review.');
      return;
    }

    setIsSubmittingProposal(true);
    try {
      const payload = {
        challengeId: selectedChallengeForTeam.id,
        title: solutionTitle,
        district: selectedChallengeForTeam.district,
        universityId: 'UNIV-JH-01',
        universityName: 'Birla Institute of Technology, Mesra',
        facultyMentor: {
          id: 'FAC-01',
          name: mentorName,
          department: mentorDept,
          designation: 'Professor & Head',
          email: 'priya.sharma@bitmesra.ac.in',
          specializations: ['Water Contamination Biosorption'],
          patentsCount: 3,
          completedProjectsCount: 12,
        },
        students,
        proposal: {
          problemUnderstanding: selectedChallengeForTeam.description,
          proposedSolution: solutionTitle,
          detailedDescription: solutionDescription,
          presentationDeckName: pptFileName,
          presentationDeckUrl: `/uploads/proposals/${pptFileName}`,
          technologyStack: ['ESP32', 'Optical Turbidity Sensor', 'LoRaWAN', 'Moringa Biosorption Columns'],
          expectedImpact: 'Supply 10,000 L/day certified potable water (<1.0 ppm fluoride) across 4 hamlets.',
          estimatedCostInr: solutionCost,
          timelineMonths: solutionDuration,
          prototypeDescription: solutionDescription,
          submittedAt: new Date().toISOString(),
          approvedByGovernment: true,
          approvedAt: new Date().toISOString(),
        },
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setProposalSubmittedSuccess(true);
        loadData();
        setTimeout(() => {
          setProposalSubmittedSuccess(false);
          setActiveTab('projects');
        }, 1500);
      } else {
        setValidationError(data.message || 'Failed to submit proposal.');
      }
    } catch (e) {
      console.error(e);
      setValidationError('Network error while submitting proposal.');
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* University Portal Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5 sm:pb-6 mb-5 sm:mb-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold text-lg sm:text-xl shadow-md">
            BIT
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                Birla Institute of Technology, Mesra
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 shrink-0">
                Tier 1 Jharkhand HEI
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ranchi Campus • Department of Environmental Engineering & Center for Innovation (CIIE)
            </p>
          </div>
        </div>

        {/* Action Tabs - Scrollable on mobile */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-bold overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`rounded-lg px-3 py-2 transition cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'assigned' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recommended Challenges ({challenges.filter((c) => c.category === 'Water Resources').length})
          </button>
          <button
            onClick={() => setActiveTab('teamBuilder')}
            className={`rounded-lg px-3 py-2 transition cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'teamBuilder' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Team & Proposal Builder
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`rounded-lg px-3 py-2 transition cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'projects' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Projects & Milestones ({projects.length})
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4 lg:grid-cols-6 mb-6 sm:mb-8 text-center text-xs">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
          <span className="text-slate-400 font-bold block text-[10px]">Assigned to BIT</span>
          <span className="text-2xl font-black text-slate-900">4</span>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 shadow-xs">
          <span className="text-emerald-700 font-bold block text-[10px]">High Match Recommendations</span>
          <span className="text-2xl font-black text-emerald-900">94%</span>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 shadow-xs">
          <span className="text-blue-700 font-bold block text-[10px]">Student Researchers</span>
          <span className="text-2xl font-black text-blue-900">28</span>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3 shadow-xs">
          <span className="text-purple-700 font-bold block text-[10px]">Faculty Mentors</span>
          <span className="text-2xl font-black text-purple-900">12</span>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 shadow-xs">
          <span className="text-amber-700 font-bold block text-[10px]">Industry Partners</span>
          <span className="text-2xl font-black text-amber-900">6</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
          <span className="text-slate-400 font-bold block text-[10px]">Completed Projects</span>
          <span className="text-2xl font-black text-slate-900">42</span>
        </div>
      </div>

      {/* TAB 1: Assigned & Recommended Challenges */}
      {activeTab === 'assigned' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Institutional Recommendations for BIT Mesra</span>
            </h3>
            <span className="text-xs text-slate-500">
              Matched by Environmental Engg, IoT Facility, and Water Quality Patents
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {challenges.map((ch) => {
              const isOpenStatewide = ch.assignedUniversityId === 'ALL_UNIVERSITIES' || ch.assignedUniversityName?.toLowerCase().includes('all univers');
              const isAssignedToThisUni = ch.assignedUniversityId === 'UNIV-JH-01' || ch.assignedUniversityName?.includes('BIT Mesra') || !ch.assignedUniversityId || isOpenStatewide;
              const isDumka = ch.id === 'CH-1024';
              const matchScore = isOpenStatewide ? 100 : isDumka ? 94 : 86;

              return (
                <div
                  key={ch.id}
                  className={`rounded-2xl border p-4 sm:p-5 shadow-xs transition ${
                    isOpenStatewide
                      ? 'border-2 border-blue-400 bg-blue-50/20'
                      : isDumka
                      ? 'border-2 border-emerald-500 bg-emerald-50/30'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{ch.id}</span>
                      <StatusBadge status={ch.status} />
                      <PriorityBadge level={ch.priority.level} score={ch.priority.score} />
                      <span className="text-xs text-slate-500">• {ch.district} District</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {isOpenStatewide ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-blue-100 border border-blue-300 px-3 py-1 text-xs font-bold text-blue-900">
                          <Globe className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                          <span>🌐 Open Statewide Challenge</span>
                        </div>
                      ) : ch.assignedUniversities && ch.assignedUniversities.length > 1 ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-900">
                          <GraduationCap className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                          <span>🏛️ Assigned to {ch.assignedUniversities.length} HEIs (incl. BIT Mesra)</span>
                        </div>
                      ) : ch.assignedUniversityName ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-900">
                          <GraduationCap className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                          <span>
                            🏛️ Assigned:{' '}
                            {ch.assignedUniversityName.split(';')[0].replace('Birla Institute of Technology, Mesra', 'BIT Mesra')}
                            {ch.assignedUniversityName.includes(';')
                              ? ` + ${ch.assignedUniversityName.split(';').length - 1} more`
                              : ''}
                          </span>
                        </div>
                      ) : null}

                      <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                        <span>{matchScore}% Institution Match</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setInspectingChallenge(ch)}
                      className="text-left text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-700 transition leading-snug cursor-pointer group flex items-center gap-1.5"
                    >
                      <span>{ch.title}</span>
                      <Sparkles className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition shrink-0" />
                    </button>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{ch.description}</p>
                  </div>

                  {/* Why this matches BIT Mesra / Statewide Open */}
                  <div className="mt-3 rounded-xl bg-white p-3 border border-slate-100 text-xs text-slate-700 space-y-1.5">
                    <span className="font-bold text-[11px] text-slate-500 uppercase block tracking-wider">
                      {isOpenStatewide ? 'Broad Open HEI Challenge Scope:' : 'Why BIT Mesra was Recommended:'}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px]">
                      {isOpenStatewide ? (
                        <>
                          <span className="rounded-md bg-blue-100 px-2 py-0.5 font-bold text-blue-900">
                            ✓ Open to all Jharkhand Universities & Engineering Colleges
                          </span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium">
                            ✓ Competitive Grant & Direct Field Pilot Deployment
                          </span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium">
                            ✓ Multiple multidisciplinary student squads can submit proposals
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium">
                            ✓ Environmental Engineering Department (30%)
                          </span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium">
                            ✓ Faculty Expert: Dr. Priya Sharma (25%)
                          </span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium">
                            ✓ Water Quality & Toxicology Testing Lab (10%)
                          </span>
                          <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-bold text-emerald-900">
                            ✓ Tier 1 Jharkhand HEI Priority (+6%)
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      <strong>{ch.impactQuestions.peopleAffectedApprox.toLocaleString()} citizens</strong> awaiting safe water solution
                    </span>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setInspectingChallenge(ch)}
                        className="w-full sm:w-auto text-center rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition cursor-pointer"
                      >
                        View Challenge
                      </button>

                      <button
                        onClick={() => handleAcceptChallenge(ch)}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition cursor-pointer"
                      >
                        <span>Accept & Form Student Team</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Multidisciplinary Team Builder & Proposal Submission */}
      {activeTab === 'teamBuilder' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Multidisciplinary Solution Formulation
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Form Applied Student & Faculty Innovation Team
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Assemble cross-departmental researchers to build prototypes and deploy pilots funded by Jharkhand innovation grants.
            </p>
          </div>

          {/* Linked Challenge Banner */}
          {selectedChallengeForTeam ? (
            <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50/50 p-3.5 sm:p-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-emerald-700 text-white font-mono font-bold px-2 py-0.5 text-[11px]">
                      {selectedChallengeForTeam.id}
                    </span>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-[10px]">
                      Challenge Accepted by BIT Mesra
                    </span>
                    <span className="text-slate-500 font-medium">• {selectedChallengeForTeam.district} District</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 pt-1">
                    {selectedChallengeForTeam.title}
                  </h4>
                </div>
                <Link
                  href={`/challenges/${selectedChallengeForTeam.id}`}
                  className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline shrink-0 text-xs"
                >
                  <span>Challenge Brief</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>Select an accepted challenge to bind your multidisciplinary proposal.</span>
              <button
                type="button"
                onClick={() => setActiveTab('assigned')}
                className="font-bold underline text-left sm:text-right cursor-pointer"
              >
                Browse Recommended Challenges →
              </button>
            </div>
          )}

          <form onSubmit={handleSubmitTeamProposal} className="space-y-6">
            {/* Faculty Mentor */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 sm:p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Principal Investigator & Faculty Mentor</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1 text-xs">Faculty PI Name</label>
                  <input
                    type="text"
                    value={mentorName}
                    onChange={(e) => setMentorName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs sm:text-sm font-medium focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1 text-xs">Academic Department</label>
                  <input
                    type="text"
                    value={mentorDept}
                    onChange={(e) => setMentorDept(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs sm:text-sm font-medium focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Multidisciplinary Student Squad - Card Format */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-3.5 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>Multidisciplinary Student Squad ({students.length} Researchers)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Click on any student card to view and inspect department, academic year, and assigned project role.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (expandedStudents.length === students.length) {
                      setExpandedStudents([]);
                    } else {
                      setExpandedStudents(students.map((_, i) => i));
                    }
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer self-start sm:self-auto bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60"
                >
                  {expandedStudents.length === students.length ? 'Collapse All Cards' : 'Expand All Cards'}
                </button>
              </div>

              {/* Grid of Student Cards: Profile Pic & Name only visible by default */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {students.map((st, idx) => {
                  const isExpanded = expandedStudents.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStudentCard(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleStudentCard(idx);
                        }
                      }}
                      className={`relative flex flex-col rounded-2xl border transition-all duration-200 text-left cursor-pointer overflow-hidden p-3.5 select-none ${
                        isExpanded
                          ? 'border-emerald-500 bg-gradient-to-b from-white to-emerald-50/40 shadow-sm ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Top Bar: Profile Pic & Name ONLY */}
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={st.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(st.name)}`}
                            alt={st.name}
                            className="h-11 w-11 rounded-full object-cover border-2 border-slate-100 shadow-2xs bg-slate-100"
                          />
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-slate-900 text-sm truncate leading-tight">
                            {st.name}
                          </h5>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            {isExpanded ? (
                              <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                                Hide details <ChevronUp className="h-3 w-3" />
                              </span>
                            ) : (
                              <span className="text-slate-400 flex items-center gap-0.5 group-hover:text-slate-600">
                                View details <ChevronDown className="h-3 w-3" />
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Expandable Details: Visible ONLY after clicking on that card */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-2 animate-in fade-in duration-200">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Department
                            </span>
                            <span className="text-slate-800 font-medium leading-snug block">
                              {st.department}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Academic Year
                            </span>
                            <span className="text-slate-600 font-medium block">
                              {st.year}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Assigned Role
                            </span>
                            <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-900 mt-0.5">
                              {st.roleInProject}
                            </span>
                          </div>

                          {st.email && (
                            <div className="pt-0.5">
                              <span className="text-[10px] font-mono text-slate-500 truncate block">
                                {st.email}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Solution Proposal Specifications */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 sm:p-5 space-y-5 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-purple-600 shrink-0" />
                <span>Applied Solution Proposal Specifications</span>
              </h4>

              {/* Validation Alert */}
              {validationError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2 animate-in fade-in duration-200">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span className="font-semibold">{validationError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-slate-800 font-semibold mb-1 text-xs">
                  Proposed Project / Solution Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={solutionTitle}
                  onChange={(e) => {
                    setSolutionTitle(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 sm:p-3 text-xs sm:text-sm font-semibold focus:border-purple-600 focus:outline-hidden"
                  placeholder="e.g. IoT-Enabled Water Quality Telemetry & Biosorption Pilot"
                  required
                />
              </div>

              {/* MANDATORY FIELD 1: Detailed Description of Proposed Solution */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-800 font-semibold text-xs">
                    Detailed Description of Proposed Solution <span className="text-rose-500">* (Mandatory)</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {solutionDescription.length} characters (min. 30)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-1.5">
                  Describe technical architecture, engineering methodology, sensors/components required, and ground deployment plan for state evaluation.
                </p>
                <textarea
                  rows={4}
                  value={solutionDescription}
                  onChange={(e) => {
                    setSolutionDescription(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  required
                  placeholder="Provide a comprehensive technical description of how your university squad will solve the problem..."
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm leading-relaxed font-normal focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              {/* MANDATORY FIELD 2: Solution Presentation Deck (PPT / PPTX / PDF) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-800 font-semibold text-xs">
                    Solution Presentation Deck (PPT / PPTX / PDF) <span className="text-rose-500">* (Mandatory)</span>
                  </label>
                  <span className="text-[11px] text-amber-700 font-medium">Required for Government Funding Committee</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">
                  Attach your multidisciplinary squad presentation deck summarizing system diagrams, bill of materials, and milestone plan.
                </p>

                {pptFileName ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white font-bold text-xs shadow-xs">
                        PPT
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                            {pptFileName}
                          </span>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 shrink-0">
                            Attached ✓
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {pptFileSize} • Ready for state committee review
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <label
                        htmlFor="ppt-upload"
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Change PPT
                      </label>
                      <button
                        type="button"
                        onClick={handleRemovePpt}
                        className="rounded-lg border border-rose-200 bg-white p-1.5 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Remove attached deck"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-5 text-center hover:border-purple-400 transition">
                    <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <label
                      htmlFor="ppt-upload"
                      className="text-xs font-bold text-purple-700 hover:text-purple-800 hover:underline cursor-pointer block"
                    >
                      Click to upload presentation deck (.pptx, .ppt, .pdf)
                    </label>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Max file size: 25 MB • Pitch deck format
                    </span>
                    <button
                      type="button"
                      onClick={handlePreloadDemoPpt}
                      className="mt-3 inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                    >
                      <Paperclip className="h-3 w-3 text-slate-500" />
                      <span>Pre-load BIT Mesra Pilot Deck (PPTX)</span>
                    </button>
                  </div>
                )}

                <input
                  id="ppt-upload"
                  type="file"
                  accept=".ppt,.pptx,.pdf"
                  onChange={handlePptFileChange}
                  className="hidden"
                />
              </div>

              {/* Budget and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-slate-700 font-semibold text-xs">Estimated Pilot Budget</label>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 font-mono">
                      ₹{solutionCost.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="800000"
                    step="25000"
                    value={solutionCost}
                    onChange={(e) => setSolutionCost(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹1.0 Lakh</span>
                    <span>₹4.5 Lakh</span>
                    <span>₹8.0 Lakh</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-slate-700 font-semibold text-xs">Implementation Timeline</label>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 font-mono">
                      {solutionDuration} Months
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    step="1"
                    value={solutionDuration}
                    onChange={(e) => setSolutionDuration(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>2 Months (Fast-track)</span>
                    <span>6 Months</span>
                    <span>12 Months</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit & Cancel Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('assigned')}
                className="w-full sm:w-auto text-center py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 border sm:border-0 border-slate-200 rounded-xl sm:rounded-none transition cursor-pointer"
              >
                Cancel & Return
              </button>

              <button
                type="submit"
                disabled={isSubmittingProposal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#0B192C] px-6 py-3.5 sm:py-3 text-xs font-bold text-white hover:bg-[#1E3E62] shadow-md disabled:opacity-50 transition cursor-pointer text-center"
              >
                {isSubmittingProposal ? (
                  <>Submitting Proposal...</>
                ) : proposalSubmittedSuccess ? (
                  <>Proposal Submitted Successfully ✓</>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 shrink-0" />
                    <span>Submit Multidisciplinary Solution Proposal</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Active Projects & Milestones */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600 shrink-0" />
              <span>University Projects & 9-Stage Milestone Tracker</span>
            </h3>
            <span className="text-xs text-slate-500">Live progress linked to Government and Industry dashboards</span>
          </div>

          <div className="space-y-6">
            {projects.map((proj) => (
              <div key={proj.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{proj.id}</span>
                      <StatusBadge status={proj.stage} />
                      <span className="text-xs text-slate-500">• {proj.district} District</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1">{proj.title}</h4>
                  </div>

                  <Link
                    href={`/projects/${proj.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline shrink-0"
                  >
                    <span>Inspect Full Project</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Team Info Strip */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span>
                    Faculty Mentor: <strong>{proj.facultyMentor.name}</strong> ({proj.facultyMentor.department})
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>
                    Team: <strong>{proj.students.length} Student Engineers</strong>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>
                    Budget: <strong>₹{proj.proposal.estimatedCostInr.toLocaleString()}</strong>
                  </span>
                  {proj.collaborations.length > 0 && (
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-purple-900 font-bold">
                      Industry Partner: {proj.collaborations[0].startupName}
                    </span>
                  )}
                </div>

                {/* Milestones Progress Bars */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Project Milestones Progression:
                  </span>

                  <div className="space-y-2">
                    {proj.milestones.map((m) => (
                      <div key={m.id} className="rounded-xl border border-slate-200 p-3 bg-white space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{m.title}</span>
                          <span className="font-mono font-bold text-emerald-700">{m.progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                            style={{ width: `${m.progressPercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-1">
                          <span>Responsible: {m.responsibleLead}</span>
                          <span>Deadline: {m.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHALLENGE INSPECTION MODAL */}
      {inspectingChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold bg-slate-200 text-slate-800 px-2.5 py-1 rounded-md">
                  {inspectingChallenge.id}
                </span>
                <StatusBadge status={inspectingChallenge.status} />
                <PriorityBadge
                  level={inspectingChallenge.priority.level}
                  score={inspectingChallenge.priority.score}
                />
                <span className="text-xs text-slate-500 font-medium">
                  • {inspectingChallenge.district} District
                </span>
              </div>

              <button
                type="button"
                onClick={() => setInspectingChallenge(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
                aria-label="Close Challenge Preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Title & Core Meta */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  {inspectingChallenge.category} • Academic Research Target
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 leading-snug">
                  {inspectingChallenge.title}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {inspectingChallenge.district} District, Jharkhand
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    Reported on {new Date(inspectingChallenge.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    {inspectingChallenge.communitySupport.supportersCount + inspectingChallenge.communitySupport.originalReportsCount} community endorsements
                  </span>
                </div>
              </div>

              {/* Citizen Problem Statement */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Ground Truth Problem Statement
                </span>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {inspectingChallenge.description}
                </p>

                {inspectingChallenge.evidence && inspectingChallenge.evidence.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-500 block mb-2">Field Evidence Submitted:</span>
                    <div className="flex flex-wrap gap-2">
                      {inspectingChallenge.evidence.map((ev, i) => (
                        <div key={ev.id || i} className="relative group overflow-hidden rounded-lg border border-slate-200 shadow-2xs">
                          <img
                            src={ev.url}
                            alt={ev.caption || 'Field evidence'}
                            className="h-24 w-36 object-cover"
                          />
                          {ev.caption && (
                            <span className="absolute bottom-0 inset-x-0 bg-black/60 px-1.5 py-0.5 text-[9px] text-white truncate">
                              {ev.caption}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Citizen Impact Metrics Grid */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
                  Field Impact Assessment Data
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                    <span className="text-[11px] text-slate-500 block">Citizens Affected</span>
                    <span className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 block">
                      {inspectingChallenge.impactQuestions.peopleAffectedApprox.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400">Directly impacted</span>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                    <span className="text-[11px] text-slate-500 block">Occurrence Frequency</span>
                    <span className="text-sm sm:text-base font-bold text-slate-900 mt-0.5 block capitalize">
                      {inspectingChallenge.impactQuestions.frequency}
                    </span>
                    <span className="text-[10px] text-slate-400">Continuous risk</span>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                    <span className="text-[11px] text-slate-500 block">Immediate Health Hazard</span>
                    <span className={`text-sm sm:text-base font-bold mt-0.5 block ${
                      inspectingChallenge.impactQuestions.immediateRisk ? 'text-rose-700' : 'text-slate-800'
                    }`}>
                      {inspectingChallenge.impactQuestions.immediateRisk ? 'Critical Risk' : 'Monitored'}
                    </span>
                    <span className="text-[10px] text-slate-400">Requires lab testing</span>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                    <span className="text-[11px] text-slate-500 block">Civic Disruption</span>
                    <span className={`text-sm sm:text-base font-bold mt-0.5 block ${
                      inspectingChallenge.impactQuestions.affectsPublicServices ? 'text-amber-700' : 'text-slate-800'
                    }`}>
                      {inspectingChallenge.impactQuestions.affectsPublicServices ? 'Public Services' : 'Local Community'}
                    </span>
                    <span className="text-[10px] text-slate-400">Over {inspectingChallenge.impactQuestions.durationMonths} months</span>
                  </div>
                </div>
              </div>

              {/* Sangam AI Problem Comprehension */}
              <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50/70 to-emerald-50/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-teal-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-900">
                      Sangam AI Problem Comprehension
                    </span>
                  </div>
                  <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-teal-800">
                    {inspectingChallenge.aiAnalysis.confidence}% AI Confidence
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-2">
                  <div>
                    <span className="font-semibold text-slate-900">Technical Taxonomy & Domain: </span>
                    <span className="rounded-md bg-white/80 px-2 py-0.5 font-mono text-[11px] border border-teal-200">
                      {inspectingChallenge.category} • {inspectingChallenge.aiAnalysis.subcategory || inspectingChallenge.aiAnalysis.affectedDomain}
                    </span>
                  </div>

                  {inspectingChallenge.aiAnalysis.problemSummary && (
                    <div>
                      <span className="font-semibold text-slate-900">AI Problem Summary: </span>
                      <span>{inspectingChallenge.aiAnalysis.problemSummary}</span>
                    </div>
                  )}

                  {inspectingChallenge.aiAnalysis.recommendedExpertise && inspectingChallenge.aiAnalysis.recommendedExpertise.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-900">Recommended Academic Expertise: </span>
                      <span className="text-teal-900 font-medium">
                        {inspectingChallenge.aiAnalysis.recommendedExpertise.join(', ')}
                      </span>
                    </div>
                  )}

                  {inspectingChallenge.aiAnalysis.keywords && inspectingChallenge.aiAnalysis.keywords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      <span className="font-semibold text-slate-900 text-[11px]">Key Concepts: </span>
                      {inspectingChallenge.aiAnalysis.keywords.map((kw, i) => (
                        <span key={i} className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-teal-800 border border-teal-100">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Why BIT Mesra Match / Open Statewide Track */}
              {inspectingChallenge.assignedUniversityId === 'ALL_UNIVERSITIES' || inspectingChallenge.assignedUniversityName?.toLowerCase().includes('all univers') ? (
                <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-blue-700" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      Open Statewide Challenge Track
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span><strong>Eligibility:</strong> Open to all accredited Jharkhand Universities & Colleges</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span><strong>Opportunity:</strong> Direct field prototype deployment in {inspectingChallenge.district}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span><strong>State Grant:</strong> ₹5,00,000 sanctioned for winning multidisciplinary pilot</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span><strong>Next Action:</strong> Form student squad and upload solution PPT deck</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-emerald-700" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                      Institutional Match Profile ({inspectingChallenge.assignedUniversityName ? inspectingChallenge.assignedUniversityName.replace('Birla Institute of Technology, Mesra', 'BIT Mesra') : 'BIT Mesra'})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span><strong>Department:</strong> {inspectingChallenge.assignedDepartment || 'Environmental Engineering & Biotechnology'}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span><strong>Faculty Mentor:</strong> Dr. Priya Sharma (Biosorption Lead)</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span><strong>Lab Facility:</strong> Water Quality & Toxicology Testing Lab</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span><strong>Innovation Grant:</strong> ₹5,00,000 sanctioned for Student Pilot</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectingChallenge(null)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Close Preview
                </button>
                <Link
                  href={`/challenges/${inspectingChallenge.id}`}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition"
                >
                  <span>Open Public Page</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <button
                type="button"
                onClick={() => {
                  const target = inspectingChallenge;
                  setInspectingChallenge(null);
                  handleAcceptChallenge(target);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition cursor-pointer"
              >
                <span>Accept Challenge & Form Student Team</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
