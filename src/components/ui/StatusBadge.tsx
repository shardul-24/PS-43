'use client';

import React from 'react';
import { ChallengeStatus, ProjectStage } from '@/types';

interface StatusBadgeProps {
  status: ChallengeStatus | ProjectStage | string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'Submitted':
      colorStyles = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Under Review':
      colorStyles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      break;
    case 'Verified':
      colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold';
      break;
    case 'Needs Information':
      colorStyles = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'Duplicate':
      colorStyles = 'bg-zinc-100 text-zinc-600 border-zinc-200';
      break;
    case 'Routed':
      colorStyles = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'Accepted':
      colorStyles = 'bg-teal-50 text-teal-700 border-teal-300';
      break;
    case 'Solution Development':
    case 'Proposal':
    case 'Prototype':
      colorStyles = 'bg-sky-50 text-sky-700 border-sky-300';
      break;
    case 'Testing':
    case 'Pilot':
      colorStyles = 'bg-amber-50 text-amber-800 border-amber-300 font-medium';
      break;
    case 'Implemented':
    case 'Deployment':
    case 'Completed':
      colorStyles = 'bg-green-50 text-green-700 border-green-300 font-semibold';
      break;
    case 'Impact Measured':
    case 'Impact Validation':
      colorStyles = 'bg-emerald-100 text-emerald-800 border-emerald-400 font-bold';
      break;
  }

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium tracking-wide shadow-xs ${colorStyles} ${sizeStyles}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
      {status}
    </span>
  );
}
