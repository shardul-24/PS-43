'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Sparkles,
  Award,
  Layers,
  CheckCircle2,
  Send,
  Building2,
  DollarSign,
  TrendingUp,
  Cpu,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Project, Startup, CollaborationType } from '@/types';

const COLLABORATION_TYPES: CollaborationType[] = [
  'Mentorship',
  'Funding',
  'Technology',
  'Prototype Development',
  'Testing & Certification',
  'Pilot Deployment',
  'Manufacturing',
  'Distribution & Scale',
];

export default function StartupIndustryHub() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'discover' | 'active'>('discover');

  // Offer Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<CollaborationType[]>([
    'Prototype Development',
    'Pilot Deployment',
    'Funding',
  ]);
  const [contributionDetails, setContributionDetails] = useState(
    'Committed 4 commercial-grade optical probe housings, free SIM telemetry for 2 years, and ₹1.5 Lakhs matching grant for village kiosk fabrication.'
  );
  const [fundingAmount, setFundingAmount] = useState(150000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const loadData = () => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setProjects(json.data);
          const p301 = json.data.find((p: Project) => p.id === 'PRJ-301');
          if (p301) setSelectedProject(p301);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleType = (type: CollaborationType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSendCollaborationOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject.id,
          startupId: 'STP-01',
          startupName: 'JalRakshak IoT Technologies Pvt Ltd',
          types: selectedTypes,
          contributionDetails,
          fundingCommittedInr: fundingAmount,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(true);
        loadData();
        setTimeout(() => {
          setSuccessMessage(false);
          setIsModalOpen(false);
          setActiveTab('active');
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCollaborations = projects.filter((p) => p.collaborations.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hub Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-900 text-white font-bold text-xl shadow-md">
            JR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">JalRakshak IoT Technologies</h1>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-900">
                Jharkhand CleanTech Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ranchi, Jharkhand • Water Sensors, IoT Telemetry & Rural Water Infrastructure Innovation Partner
            </p>
          </div>
        </div>

        {/* Tab switcher - Scrollable on mobile */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-bold overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => setActiveTab('discover')}
            className={`rounded-lg px-3 py-2 transition cursor-pointer shrink-0 ${
              activeTab === 'discover' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Discover R&D Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`rounded-lg px-3 py-2 transition cursor-pointer shrink-0 ${
              activeTab === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Active Partnerships ({activeCollaborations.length})
          </button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 text-center text-xs">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
          <span className="text-slate-400 font-bold block text-[10px]">Matching Academic Projects</span>
          <span className="text-2xl font-black text-slate-900">{projects.length}</span>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3 shadow-xs">
          <span className="text-purple-700 font-bold block text-[10px]">Committed Grants & Hardware</span>
          <span className="text-2xl font-black text-purple-950">₹3.5 Lakhs</span>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 shadow-xs">
          <span className="text-emerald-700 font-bold block text-[10px]">Active Pilot Deployments</span>
          <span className="text-2xl font-black text-emerald-950">{activeCollaborations.length}</span>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 shadow-xs">
          <span className="text-blue-700 font-bold block text-[10px]">Villages Impacted</span>
          <span className="text-2xl font-black text-blue-950">6 Hamlets</span>
        </div>
      </div>

      {/* TAB 1: Discover & Recommended Projects */}
      {activeTab === 'discover' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Recommended Projects Matching Your IoT & Water Expertise
            </h3>
            <span className="text-xs text-slate-500">Based on hardware sensors, telemetry & telemetry needs</span>
          </div>

          <div className="space-y-4">
            {projects.map((proj) => {
              const isP301 = proj.id === 'PRJ-301';
              const matchScore = isP301 ? 91 : 84;

              return (
                <div
                  key={proj.id}
                  className={`rounded-2xl border p-5 shadow-xs transition ${
                    isP301 ? 'border-2 border-purple-500 bg-purple-50/20' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">{proj.id}</span>
                        <StatusBadge status={proj.stage} />
                        <span className="text-xs text-slate-500">
                          • {proj.universityName} • {proj.district}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mt-1">{proj.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-900">
                        {matchScore}% Industry Synergy
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {proj.proposal.problemUnderstanding}
                  </p>

                  {/* Tech Stack synergy */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-[10px] uppercase text-slate-400">Tech Stack:</span>
                    {proj.proposal.technologyStack.map((tech, tIdx) => (
                      <span key={tIdx} className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-500">
                      Estimated Pilot Cost: <strong>₹{proj.proposal.estimatedCostInr.toLocaleString()}</strong>
                    </span>

                    <button
                      onClick={() => {
                        setSelectedProject(proj);
                        setIsModalOpen(true);
                      }}
                      className="rounded-xl bg-purple-700 px-4 py-2 text-xs font-bold text-white hover:bg-purple-800 transition shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Briefcase className="h-4 w-4" />
                      <span>Pledge Industry Collaboration</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Active Collaborations */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-base">
              Active Industry-University Partnerships
            </h3>
          </div>

          {activeCollaborations.map((proj) => (
            <div key={proj.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-500">{proj.id}</span>
                  <h4 className="text-lg font-bold text-slate-900">{proj.title}</h4>
                  <p className="text-xs text-slate-500">
                    Lead Institution: <strong>{proj.universityName}</strong> ({proj.facultyMentor.name})
                  </p>
                </div>
                <StatusBadge status={proj.stage} />
              </div>

              <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 space-y-2 text-xs">
                <span className="font-bold text-purple-950 uppercase text-[10px] tracking-wider block">
                  Your Pledged Contributions:
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {proj.collaborations[0]?.contributionDetails || 'Committed prototype hardware and sensor telemetry.'}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {proj.collaborations[0]?.types.map((type, idx) => (
                    <span key={idx} className="rounded-full bg-white px-2.5 py-0.5 font-semibold text-purple-800 border border-purple-200">
                      ✓ {type}
                    </span>
                  ))}
                  {proj.collaborations[0]?.fundingCommittedInr && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-bold text-emerald-800">
                      ₹{proj.collaborations[0].fundingCommittedInr.toLocaleString()} Seed Funding Active
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href={`/projects/${proj.id}`}
                  className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                >
                  <span>Track Full Project Lifecycle & Sensor Logs</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Collaboration Pledging Modal */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-xs pb-safe">
          <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl space-y-4 overflow-y-auto">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                Pledge Resources & Mentorship
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Offer Collaboration on {selectedProject.id}
              </h3>
              <p className="text-xs text-slate-500">
                Project: {selectedProject.title} ({selectedProject.universityName})
              </p>
            </div>

            <form onSubmit={handleSendCollaborationOffer} className="space-y-4 text-xs">
              {/* Collaboration Type Checkboxes */}
              <div>
                <label className="font-bold text-slate-700 block mb-2">
                  Select Collaboration Offerings:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COLLABORATION_TYPES.map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => handleToggleType(type)}
                      className={`rounded-lg p-2 text-left border font-semibold transition ${
                        selectedTypes.includes(type)
                          ? 'border-purple-600 bg-purple-50 text-purple-900'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {selectedTypes.includes(type) ? '✓ ' : '+ '}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Funding Grant Committed */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Pledged Matching Seed Grant: ₹{fundingAmount.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="25000"
                  max="500000"
                  step="25000"
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              {/* Contribution Details */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Specific Resources & Technical Contribution:
                </label>
                <textarea
                  rows={3}
                  value={contributionDetails}
                  onChange={(e) => setContributionDetails(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-500 font-semibold hover:underline"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-purple-700 px-5 py-2.5 font-bold text-white hover:bg-purple-800 transition shadow-sm"
                >
                  {isSubmitting ? (
                    <>Transmitting Offer...</>
                  ) : successMessage ? (
                    <>Offer Accepted by University & Government ✓</>
                  ) : (
                    <>Send Formal Collaboration Offer</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
