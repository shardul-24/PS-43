'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Sparkles,
  GraduationCap,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Building2,
  FileCheck,
  ShieldCheck,
  Heart,
  Droplets,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Project } from '@/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'milestones' | 'team' | 'proposal' | 'impact'>('milestones');
  const [updatingMilestone, setUpdatingMilestone] = useState<string | null>(null);

  const loadProject = () => {
    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setProject(json.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (projectId) loadProject();
  }, [projectId]);

  const handleUpdateMilestoneProgress = async (milestoneId: string, currentProgress: number) => {
    setUpdatingMilestone(milestoneId);
    const newProgress = currentProgress >= 100 ? 0 : Math.min(100, currentProgress + 35);
    const newStatus = newProgress === 100 ? 'COMPLETED' : 'IN_PROGRESS';

    try {
      const res = await fetch(`/api/projects/${projectId}/milestones`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneId,
          progressPercent: newProgress,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProject(data.data);
        if (newProgress === 100) {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingMilestone(null);
    }
  };

  if (!project) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-500">
        <Sparkles className="h-6 w-6 text-emerald-500 animate-spin mx-auto mb-2" />
        Loading project details...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/university" className="hover:underline">
            Projects
          </Link>
          <span>/</span>
          <span className="font-mono font-bold text-slate-800">{project.id}</span>
          <span>/</span>
          <span>{project.district} District</span>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={project.stage} size="lg" />
          <Link
            href={`/challenges/${project.challengeId}`}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Linked Challenge: {project.challengeId} →
          </Link>
        </div>
      </div>

      {/* Title & Affiliation Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Applied Academic Innovation Project
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{project.title}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Led by <strong>{project.universityName}</strong> • Faculty Mentor:{' '}
              <strong>{project.facultyMentor.name}</strong> ({project.facultyMentor.department})
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center min-w-[110px]">
              <span className="text-[10px] font-bold uppercase text-slate-400">Budget</span>
              <div className="text-lg font-black text-slate-900">
                ₹{(project.proposal.estimatedCostInr / 100000).toFixed(2)}L
              </div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center min-w-[110px]">
              <span className="text-[10px] font-bold uppercase text-slate-400">Beneficiaries</span>
              <div className="text-lg font-black text-emerald-600">
                {project.impactMetrics?.peopleBenefited.toLocaleString()}+
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('milestones')}
            className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
              activeTab === 'milestones' ? 'bg-[#0B192C] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Milestones Tracker ({project.milestones.length})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
              activeTab === 'team' ? 'bg-[#0B192C] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Multidisciplinary Team ({project.students.length + 1})
          </button>
          <button
            onClick={() => setActiveTab('proposal')}
            className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
              activeTab === 'proposal' ? 'bg-[#0B192C] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Solution Proposal
          </button>
          <button
            onClick={() => setActiveTab('impact')}
            className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
              activeTab === 'impact' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Social Impact Outcomes
          </button>
        </div>
      </div>

      {/* TAB 1: Milestones Tracker */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">Project Implementation Milestones</h3>
            <span className="text-xs text-slate-500">
              Click &ldquo;Advance Progress&rdquo; to demonstrate milestone progression
            </span>
          </div>

          <div className="space-y-4">
            {project.milestones.map((m) => (
              <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{m.title}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          m.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-lg text-emerald-700">{m.progressPercent}%</span>
                    <button
                      onClick={() => handleUpdateMilestoneProgress(m.id, m.progressPercent)}
                      disabled={updatingMilestone === m.id}
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
                    >
                      {m.progressPercent >= 100 ? 'Reset Milestone' : '+ Advance Progress'}
                    </button>
                  </div>
                </div>

                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${m.progressPercent}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
                  <span>
                    Lead: <strong>{m.responsibleLead}</strong>
                  </span>
                  <span>
                    Deadline: <strong>{m.deadline}</strong>
                  </span>
                  {m.deliverables && (
                    <span className="text-emerald-700 font-medium">
                      Deliverable: {m.deliverables.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Multidisciplinary Team */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-600" />
              Faculty Mentor & Principal Investigator
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px]">Name & Title</span>
                <span className="font-bold text-slate-900 text-sm">{project.facultyMentor.name}</span>
                <div className="text-slate-500">{project.facultyMentor.designation}</div>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Department</span>
                <span className="font-bold text-slate-900">{project.facultyMentor.department}</span>
                <div className="text-slate-500">{project.facultyMentor.email}</div>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Research Track Record</span>
                <span className="font-semibold text-emerald-700">
                  {project.facultyMentor.patentsCount} Patents • {project.facultyMentor.completedProjectsCount} Completed Projects
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Multidisciplinary Student Squad ({project.students.length} Members)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {project.students.map((st, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                  <div className="font-bold text-slate-900 text-sm">{st.name}</div>
                  <div className="text-slate-600 mt-0.5">{st.department}</div>
                  <div className="text-slate-500 text-[11px]">{st.year}</div>
                  <div className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                    Role: {st.roleInProject}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Solution Proposal */}
      {activeTab === 'proposal' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Formal Solution Proposal Details
          </h3>

          <div>
            <span className="font-bold text-slate-700 block mb-1">Problem Understanding:</span>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {project.proposal.problemUnderstanding}
            </p>
          </div>

          <div>
            <span className="font-bold text-slate-700 block mb-1">Proposed Engineering Solution:</span>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {project.proposal.proposedSolution}
            </p>
          </div>

          <div>
            <span className="font-bold text-slate-700 block mb-1">Applied Technology Stack:</span>
            <div className="flex flex-wrap gap-2">
              {project.proposal.technologyStack.map((tech, i) => (
                <span key={i} className="rounded-md bg-blue-50 px-2.5 py-1 font-semibold text-blue-800 border border-blue-200">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-700 block mb-1">Prototype Architecture:</span>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {project.proposal.prototypeDescription}
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: Social Impact Outcomes */}
      {activeTab === 'impact' && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/40 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Verified Societal Impact Assessment
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Pre vs Post Intervention Outcomes</h3>
            </div>
            <span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-black text-emerald-900">
              Impact Score: {project.impactMetrics?.impactScore || 92}/100
            </span>
          </div>

          {/* Before and After Comparison Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                Condition Before Intervention:
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {project.impactMetrics?.beforeCondition ||
                  'High mineral toxicity, foul metallic odor, recurrent waterborne infections.'}
              </p>
              <div className="rounded bg-white p-2 border border-rose-100 text-rose-800 font-bold">
                Fluoride: 4.2 mg/L • 68% illness incidence rate
              </div>
            </div>

            <div className="rounded-xl border border-emerald-300 bg-emerald-100/70 p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
                Condition After Solution Deployment:
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {project.impactMetrics?.afterCondition ||
                  'Potable clear drinking water restored, telemetry sensors transmitting live safe readings.'}
              </p>
              <div className="rounded bg-white p-2 border border-emerald-200 text-emerald-900 font-bold">
                Fluoride: 0.8 mg/L • 85% reduction in illnesses
              </div>
            </div>
          </div>

          {/* Core Quantifiable Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
            <div className="rounded-xl bg-white p-3 border border-emerald-200">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Citizens Benefited</span>
              <span className="text-2xl font-black text-emerald-700">
                {project.impactMetrics?.peopleBenefited.toLocaleString()}+
              </span>
            </div>
            <div className="rounded-xl bg-white p-3 border border-emerald-200">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Villages Covered</span>
              <span className="text-2xl font-black text-slate-900">
                {project.impactMetrics?.villagesCovered || 4} Hamlets
              </span>
            </div>
            <div className="rounded-xl bg-white p-3 border border-emerald-200">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Daily Time Saved</span>
              <span className="text-base font-bold text-slate-800 mt-1 block">
                2.5 Hours / Family
              </span>
            </div>
            <div className="rounded-xl bg-white p-3 border border-emerald-200">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Annual Cost Saved</span>
              <span className="text-2xl font-black text-slate-900">
                ₹{((project.impactMetrics?.costSavedInr || 420000) / 100000).toFixed(1)} Lakhs
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
