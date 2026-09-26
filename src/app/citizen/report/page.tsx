'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  CheckCircle2,
  Sparkles,
  MapPin,
  AlertTriangle,
  FileText,
  Layers,
  Users,
  Mic,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { JHARKHAND_DISTRICTS } from '@/data/seedData';
import { ChallengeCategory } from '@/types';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';

const CATEGORIES: ChallengeCategory[] = [
  'Water Resources',
  'Healthcare',
  'Agriculture',
  'Sanitation',
  'Environment & Forestry',
  'Energy',
  'Urban Development',
  'Rural Livelihoods',
  'Infrastructure & Connectivity',
  'Education & Skill',
  'Mining Impact & Remediation',
  'Accessibility & Disability',
  'Public Administration',
  'Disaster Management',
  'Other',
];

export default function ReportChallengeWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ChallengeCategory>('Water Resources');
  const [subcategory, setSubcategory] = useState('');

  // Evidence
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [voiceNoteActive, setVoiceNoteActive] = useState(false);

  // Location
  const [district, setDistrict] = useState('Dumka');
  const [block, setBlock] = useState('Shikaripara');
  const [villageOrCity, setVillageOrCity] = useState('Banjhi Hamlet');
  const [latitude, setLatitude] = useState(24.2677);
  const [longitude, setLongitude] = useState(87.2497);

  // Impact
  const [peopleAffectedApprox, setPeopleAffectedApprox] = useState(1240);
  const [frequency, setFrequency] = useState<'Continuous' | 'Daily' | 'Weekly' | 'Seasonal' | 'Occasional'>('Continuous');
  const [durationMonths, setDurationMonths] = useState(6);
  const [immediateRisk, setImmediateRisk] = useState(true);
  const [affectsPublicServices, setAffectsPublicServices] = useState(true);

  // AI & Duplicate Analysis Result
  const [aiResult, setAiResult] = useState<any>(null);

  // 1-Click Autofill for Judge Demo
  const handleAutofillDemo = () => {
    setTitle('Drinking water contamination affecting villages near Dumka');
    setDescription(
      'The drinking water supplied through handpumps and the piped village reservoir in Shikaripara and adjoining hamlets has a foul metallic smell, yellowish discoloration, and chemical froth. Over 1,240 villagers are experiencing frequent gastrointestinal pain, skin rashes, and dental fluorosis. The water table has turned hazardous after unlined stone-crusher slurry washed into the local feeder stream during pre-monsoon rains.'
    );
    setCategory('Water Resources');
    setSubcategory('Groundwater Contamination & Fluorosis');
    setDistrict('Dumka');
    setBlock('Shikaripara');
    setVillageOrCity('Banjhi Hamlet & Mohulpahari Cluster');
    setLatitude(24.2677);
    setLongitude(87.2497);
    setPeopleAffectedApprox(1240);
    setFrequency('Continuous');
    setDurationMonths(6);
    setImmediateRisk(true);
    setAffectsPublicServices(true);
    setEvidenceUrls([
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
    ]);
  };

  // Move to Step 5: Trigger AI Analysis
  const handleProceedToReview = async () => {
    setIsAnalyzing(true);
    setCurrentStep(5);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          latitude,
          longitude,
          impactQuestions: { peopleAffectedApprox, immediateRisk },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiResult(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit Challenge to Database
  const handleSubmitChallenge = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        title,
        description,
        category: aiResult?.analysis?.category || category,
        subcategory: subcategory || aiResult?.analysis?.subcategory,
        district,
        block,
        villageOrCity,
        latitude,
        longitude,
        submittedBy: {
          id: 'USR-CIT-01',
          name: 'Rameshwar Tudu',
          district,
          isAnonymous: false,
        },
        evidence: evidenceUrls.map((url) => ({
          type: 'image',
          url,
          caption: 'Citizen uploaded evidence photo',
        })),
        impactQuestions: {
          peopleAffectedApprox,
          frequency,
          durationMonths,
          immediateRisk,
          affectsPublicServices,
        },
      };

      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        router.push(`/challenges/${json.data.id}`);
      } else {
        alert(json.message || 'Error creating challenge');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Wizard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4 mb-4 sm:mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Citizen Co-Creation Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Report a Societal Challenge</h1>
          <p className="text-xs text-slate-500">
            Submit your community concern to be understood by AI, verified by government, and matched with Jharkhand universities.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutofillDemo}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-500/15 border border-amber-400/30 px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-500/25 transition cursor-pointer shrink-0"
        >
          <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
          <span>Autofill Demo: Dumka Water</span>
        </button>
      </div>

      {/* Mobile Stepper Header (< sm) */}
      <div className="sm:hidden mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-800">
            Step {currentStep} of 5: {[
              'Describe Problem',
              'Evidence & Photos',
              'Location Details',
              'Impact Assessment',
              'AI Review & Similar',
            ][currentStep - 1]}
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            {Math.round((currentStep / 5) * 100)}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Stepper Progress (>= sm) */}
      <div className="hidden sm:grid grid-cols-5 gap-2 mb-8">
        {[
          { num: 1, label: 'Describe' },
          { num: 2, label: 'Evidence' },
          { num: 3, label: 'Location' },
          { num: 4, label: 'Impact' },
          { num: 5, label: 'AI Review & Similar' },
        ].map((s) => (
          <div
            key={s.num}
            className={`rounded-xl border p-2 text-center transition ${
              s.num === currentStep
                ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                : s.num < currentStep
                ? 'border-emerald-500 bg-emerald-50/50'
                : 'border-slate-200 bg-white opacity-60'
            }`}
          >
            <div className="text-[10px] font-bold text-slate-500">STEP {s.num}</div>
            <div className="text-xs font-bold text-slate-900 truncate">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Wizard Steps Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        {/* STEP 1: Describe */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Step 1: Describe the Problem</h3>
            <p className="text-xs text-slate-500">
              Describe in your own natural language what is happening, where it occurs, and why it poses a challenge to your community.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Problem Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Drinking water contamination affecting villages near Dumka"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Domain Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ChallengeCategory)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-white focus:border-blue-600 focus:outline-hidden"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subcategory (Optional)
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g., Groundwater Contamination & Fluorosis"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Natural Language Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., The drinking water supplied to our village has a bad smell and residents are worried about contamination..."
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-600 focus:outline-hidden leading-relaxed"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4">
              <button
                disabled={!title.trim() || !description.trim()}
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg bg-[#0B192C] px-5 py-3 sm:py-2.5 text-xs font-bold text-white hover:bg-[#1E3E62] disabled:opacity-40 transition cursor-pointer"
              >
                <span>Continue to Evidence</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Evidence */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Step 2: Upload Evidence</h3>
            <p className="text-xs text-slate-500">
              High-quality photos, lab test slips, or voice recordings increase your Citizen Impact Score (+120 pts) and accelerate government verification.
            </p>

            {/* Photo Drag & Drop Simulation */}
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-700">Drag & drop photos or test documents</div>
              <div className="text-[11px] text-slate-500 mt-1">PNG, JPG, PDF up to 10MB</div>
              <button
                type="button"
                onClick={() =>
                  setEvidenceUrls([
                    'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
                  ])
                }
                className="mt-3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                + Attach Sample Field Water Photo
              </button>
            </div>

            {evidenceUrls.length > 0 && (
              <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  1 Geotagged Field Evidence photo attached
                </span>
                <button onClick={() => setEvidenceUrls([])} className="text-rose-600 underline text-xs">
                  Remove
                </button>
              </div>
            )}

            {/* Audio Voice Note Option */}
            <div className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Mic className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Voice Note Audio Explanation</div>
                  <div className="text-[11px] text-slate-500">Record natural speech for vernacular accessibility</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVoiceNoteActive(!voiceNoteActive)}
                className={`w-full sm:w-auto rounded-lg px-3 py-2 sm:py-1.5 text-xs font-bold transition text-center ${
                  voiceNoteActive ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {voiceNoteActive ? 'Audio Attached (45s)' : 'Simulate Voice Note'}
              </button>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="w-full sm:w-auto flex items-center justify-center gap-1 rounded-lg border border-slate-300 px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="w-full sm:w-auto flex items-center justify-center gap-1 rounded-lg bg-[#0B192C] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1E3E62]"
              >
                <span>Continue to Location</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Location */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Step 3: Pinpoint Location in Jharkhand</h3>
            <p className="text-xs text-slate-500">
              Precise geolocation enables district officers to conduct spot audits and allows nearby citizens to corroborate the report.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  District <span className="text-rose-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    const found = JHARKHAND_DISTRICTS.find((d) => d.name === e.target.value);
                    if (found) {
                      setLatitude(found.latitude);
                      setLongitude(found.longitude);
                    }
                  }}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-white"
                >
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Block / Tehsil <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder="e.g. Shikaripara"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Village / Ward / Landmark <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={villageOrCity}
                  onChange={(e) => setVillageOrCity(e.target.value)}
                  placeholder="e.g. Banjhi Hamlet"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-mono">
                <MapPin className="h-4 w-4 text-rose-600" />
                Latitude: {latitude.toFixed(4)}° N, Longitude: {longitude.toFixed(4)}° E
              </span>
              <span className="text-emerald-700 font-semibold">GPS Coordinates Locked</span>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto flex items-center justify-center gap-1 rounded-lg border border-slate-300 px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="w-full sm:w-auto flex items-center justify-center gap-1 rounded-lg bg-[#0B192C] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1E3E62]"
              >
                <span>Continue to Impact</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Impact */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Step 4: Assess Community Impact</h3>
            <p className="text-xs text-slate-500">
              These answers feed directly into the transparent 5-factor Priority Engine to determine government urgency.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Approximate People Affected: <span className="font-mono text-blue-600">{peopleAffectedApprox}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={peopleAffectedApprox}
                  onChange={(e) => setPeopleAffectedApprox(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  How frequently does it occur?
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm bg-white"
                >
                  <option value="Continuous">Continuous (Non-stop ongoing distress)</option>
                  <option value="Daily">Daily (Recurring daily)</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Seasonal">Seasonal (e.g. Monsoon / Summer)</option>
                  <option value="Occasional">Occasional</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  How long has this issue existed?
                </label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm bg-white"
                >
                  <option value={1}>Less than 1 month</option>
                  <option value={3}>1 to 3 months</option>
                  <option value={6}>6 months to 1 year</option>
                  <option value={18}>1 to 2 years</option>
                  <option value={36}>Over 3 years (Chronic)</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={immediateRisk}
                    onChange={(e) => setImmediateRisk(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-rose-600"
                  />
                  <span>Is anyone at immediate health, safety, or life risk?</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={affectsPublicServices}
                    onChange={(e) => setAffectsPublicServices(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  <span>Is this disrupting public services (schools, hospitals, transit)?</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-4">
              <button
                onClick={() => setCurrentStep(3)}
                className="w-full sm:w-auto flex items-center justify-center gap-1 rounded-lg border border-slate-300 px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleProceedToReview}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-6 py-3 sm:py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>Run AI Review & Duplicate Interception</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: AI Review & Duplicate Interception */}
        {currentStep === 5 && (
          <div className="space-y-6">
            {isAnalyzing ? (
              <div className="py-12 text-center space-y-3">
                <Sparkles className="h-8 w-8 text-emerald-500 animate-spin mx-auto" />
                <div className="text-sm font-bold text-slate-900">
                  Sangam AI is analyzing your problem description...
                </div>
                <div className="text-xs text-slate-500">
                  Extracting domain keywords, assessing priority weight, and scanning existing challenges for duplicates...
                </div>
              </div>
            ) : (
              <>
                {/* AI Comprehension Card */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                        AI Understanding Summary
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-900">
                      {aiResult?.analysis?.confidence || 94}% Confidence
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-semibold text-slate-900">
                      &ldquo;We understood your problem as:&rdquo;
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-emerald-100">
                      {aiResult?.analysis?.problemSummary ||
                        `Grassroots challenge in ${category} affecting approximately ${peopleAffectedApprox} citizens in ${district} (${villageOrCity}).`}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                      <div className="bg-white p-2 rounded border border-emerald-100">
                        <span className="text-slate-400 block text-[10px]">Detected Category</span>
                        <span className="font-bold text-slate-800">{aiResult?.analysis?.category || category}</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-emerald-100">
                        <span className="text-slate-400 block text-[10px]">Estimated Priority</span>
                        <span className="font-bold text-orange-600">
                          {aiResult?.analysis?.estimatedPriority || 'HIGH'}
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded border border-emerald-100">
                        <span className="text-slate-400 block text-[10px]">Affected Population</span>
                        <span className="font-bold text-slate-800">{peopleAffectedApprox} people</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-emerald-100">
                        <span className="text-slate-400 block text-[10px]">Location</span>
                        <span className="font-bold text-slate-800">{district}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DUPLICATE / SIMILAR CHALLENGES INTERCEPTION ALERT */}
                {aiResult?.similarMatches && aiResult.similarMatches.length > 0 && (
                  <div className="rounded-xl border-2 border-amber-300 bg-amber-50/60 p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        <div>
                          <h4 className="text-sm font-bold text-amber-950">
                            Possible Related Challenges Detected
                          </h4>
                          <p className="text-xs text-amber-800">
                            Our duplicate engine discovered similar issues reported in your immediate vicinity.
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-900">
                        {aiResult.similarMatches.length} matches found
                      </span>
                    </div>

                    <div className="space-y-2 mt-2">
                      {aiResult.similarMatches.map((m: any, idx: number) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-amber-200 bg-white p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-600">{m.challengeId}</span>
                              <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[10px] font-bold text-amber-800">
                                {m.similarityScore}% Similarity
                              </span>
                              <span className="text-[11px] text-slate-500">
                                • {m.distanceKm} km away
                              </span>
                              <StatusBadge status={m.status} size="sm" />
                            </div>
                            <div className="text-xs font-bold text-slate-900 mt-1">{m.title}</div>
                            <div className="text-[11px] text-slate-500">
                              Corroborated by {m.reportedByCount} citizens
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={async () => {
                                await fetch(`/api/challenges/${m.challengeId}/support`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    userId: 'USR-CIT-01',
                                    userName: 'Rameshwar Tudu',
                                  }),
                                });
                                router.push(`/challenges/${m.challengeId}`);
                              }}
                              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                            >
                              Support Existing (+220 pts)
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Final Submission Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 py-2.5 sm:py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border sm:border-0 border-slate-200 rounded-lg sm:rounded-none"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Modify Details</span>
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmitChallenge}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#0B192C] px-6 py-3.5 sm:py-3 text-xs font-bold text-white shadow-md hover:bg-[#1E3E62] disabled:opacity-50 transition cursor-pointer text-center"
                    >
                      {isSubmitting ? (
                        <>Submitting Challenge...</>
                      ) : (
                        <>
                          <span>Submit Verified Challenge</span>
                          <ArrowRight className="h-4 w-4 text-emerald-400" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
