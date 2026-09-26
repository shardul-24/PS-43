'use client';

import React from 'react';
import { PriorityLevel } from '@/types';
import { AlertTriangle, Flame, ShieldAlert, CheckCircle } from 'lucide-react';

interface PriorityBadgeProps {
  level: PriorityLevel;
  score?: number;
  showIcon?: boolean;
}

export function PriorityBadge({ level, score, showIcon = true }: PriorityBadgeProps) {
  let color = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = CheckCircle;

  switch (level) {
    case 'CRITICAL':
      color = 'bg-rose-50 text-rose-700 border-rose-300 font-bold';
      Icon = Flame;
      break;
    case 'HIGH':
      color = 'bg-orange-50 text-orange-700 border-orange-300 font-semibold';
      Icon = AlertTriangle;
      break;
    case 'MEDIUM':
      color = 'bg-amber-50 text-amber-700 border-amber-300';
      Icon = ShieldAlert;
      break;
    case 'LOW':
      color = 'bg-slate-50 text-slate-600 border-slate-200';
      Icon = CheckCircle;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide ${color}`}
    >
      {showIcon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      <span>{level}</span>
      {score !== undefined && (
        <span className="ml-1 rounded bg-black/5 px-1 py-0.2 text-[10px] font-mono">
          {score}/100
        </span>
      )}
    </span>
  );
}
