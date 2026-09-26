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
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Challenge, Project } from '@/types';

export default function UniversityPortal() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'assigned' | 'projects' | 'teamBuilder'>('assigned');
  const [selectedChallengeForTeam, setSelectedChallengeForTeam] = useState<Challenge | null>(null);

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
    { name: 'Ananya Verma', department: 'Computer Science & Engineering', year: 'Final Year B.Tech', roleInProject: 'IoT Firmware & Cloud Lead' },
    { name: 'Rohan Soren', department: 'Environmental Engineering', year: '3rd Year B.Tech', roleInProject: 'Water Sampling & Biosorption Filter Testing' },
    { name: 'Aditya Raj', department: 'Civil Engineering', year: 'Final Year B.Tech', roleInProject: 'Rural Cistern Hydraulics & Piping' },
    { name: 'Kavita Kumari', department: 'Electronics & Communication', year: '3rd Year B.Tech', roleInProject: 'Low-power LoRaWAN Node Assembly' },
  ]);

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
    if (!selectedChallengeForTeam) return;

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
          technologyStack: ['ESP32', 'Optical Turbidity Sensor', 'LoRaWAN', 'Moringa Biosorption Columns'],
          expectedImpact: 'Supply 10,000 L/day certified potable water (<1.0 ppm fluoride) across 4 hamlets.',
          estimatedCostInr: solutionCost,
          timelineMonths: solutionDuration,
          prototypeDescription: 'Functional solar-buffered multi-probe telemetry unit and gravity biosorption columns.',
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
      }
    } catch (e) {
      console.error(e);
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
              const isDumka = ch.id === 'CH-1024';
              const matchScore = isDumka ? 94 : 86;

              return (
                <div
                  key={ch.id}
                  className={`rounded-2xl border p-4 sm:p-5 shadow-xs transition ${
                    isDumka ? 'border-2 border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{ch.id}</span>
                      <StatusBadge status={ch.status} />
                      <PriorityBadge level={ch.priority.level} score={ch.priority.score} />
                      <span className="text-xs text-slate-500">• {ch.district} District</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                        <span>{matchScore}% Institution Match</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Link
                      href={`/challenges/${ch.id}`}
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-700 transition leading-snug"
                    >
                      {ch.title}
                    </Link>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{ch.description}</p>
                  </div>

                  {/* Why this matches BIT Mesra */}
                  <div className="mt-3 rounded-xl bg-white p-3 border border-slate-100 text-xs text-slate-700 space-y-1.5">
                    <span className="font-bold text-[11px] text-slate-500 uppercase block tracking-wider">
                      Why BIT Mesra was Recommended:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px]">
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
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      <strong>{ch.impactQuestions.peopleAffectedApprox.toLocaleString()} citizens</strong> awaiting safe water solution
                    </span>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                      <Link
                        href={`/challenges/${ch.id}`}
                        className="w-full sm:w-auto text-center rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        View Challenge
                      </Link>

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

            {/* Multidisciplinary Student Squad */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-3.5 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Multidisciplinary Student Squad (4 Departments)</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">Cross-departmental collaboration</span>
              </div>

              <div className="space-y-2.5">
                {students.map((st, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-white p-3 sm:p-3.5 shadow-2xs hover:border-slate-300 transition"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Student Researcher #{idx + 1}
                        </span>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">{st.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Department
                        </span>
                        <span className="text-slate-700 font-medium">{st.department}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Academic Year
                        </span>
                        <span className="text-slate-600">{st.year}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Assigned Role
                        </span>
                        <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200/60 mt-0.5">
                          {st.roleInProject}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution Proposal Specifications */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 sm:p-4 space-y-4 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-purple-600 shrink-0" />
                <span>Applied Solution Proposal Specifications</span>
              </h4>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">
                  Proposed Project / Solution Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={solutionTitle}
                  onChange={(e) => setSolutionTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 sm:p-3 text-xs sm:text-sm font-semibold focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
}
