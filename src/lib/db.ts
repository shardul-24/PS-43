// Persistent Server-side Database Manager for SIH 2026 PS26043 - Samadhan Sangam

import fs from 'fs';
import path from 'path';
import {
  Challenge,
  University,
  Startup,
  Project,
  LeaderboardUser,
  AuditLogEntry,
  NotificationItem,
  ChallengeStatus,
  PriorityLevel,
  UniversityMatch,
} from '@/types';
import {
  SEED_CHALLENGES,
  SEED_UNIVERSITIES,
  SEED_STARTUPS,
  SEED_PROJECTS,
  SEED_LEADERBOARD,
  SEED_AUDIT_LOGS,
  SEED_NOTIFICATIONS,
  JHARKHAND_DISTRICTS,
} from '@/data/seedData';

interface DatabaseSchema {
  challenges: Challenge[];
  universities: University[];
  startups: Startup[];
  projects: Project[];
  leaderboard: LeaderboardUser[];
  auditLogs: AuditLogEntry[];
  notifications: NotificationItem[];
}

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

function initializeDb(): DatabaseSchema {
  return {
    challenges: JSON.parse(JSON.stringify(SEED_CHALLENGES)),
    universities: JSON.parse(JSON.stringify(SEED_UNIVERSITIES)),
    startups: JSON.parse(JSON.stringify(SEED_STARTUPS)),
    projects: JSON.parse(JSON.stringify(SEED_PROJECTS)),
    leaderboard: JSON.parse(JSON.stringify(SEED_LEADERBOARD)),
    auditLogs: JSON.parse(JSON.stringify(SEED_AUDIT_LOGS)),
    notifications: JSON.parse(JSON.stringify(SEED_NOTIFICATIONS)),
  };
}

export function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = initializeDb();
      writeDb(initial);
      return initial;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data) as DatabaseSchema;
  } catch (error) {
    console.error('Error reading database file, returning fallback:', error);
    return initializeDb();
  }
}

export function writeDb(data: DatabaseSchema): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing database file:', error);
  }
}

export function resetDatabase(): DatabaseSchema {
  const fresh = initializeDb();
  writeDb(fresh);
  return fresh;
}

// Challenge Operations
export function getChallenges(filters?: {
  district?: string;
  category?: string;
  status?: string;
  priority?: string;
  search?: string;
}): Challenge[] {
  const db = readDb();
  let list = db.challenges;

  if (filters) {
    if (filters.district && filters.district !== 'All') {
      list = list.filter((c) => c.district.toLowerCase() === filters.district!.toLowerCase());
    }
    if (filters.category && filters.category !== 'All') {
      list = list.filter((c) => c.category === filters.category);
    }
    if (filters.status && filters.status !== 'All') {
      list = list.filter((c) => c.status === filters.status);
    }
    if (filters.priority && filters.priority !== 'All') {
      list = list.filter((c) => c.priority.level === filters.priority);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q)
      );
    }
  }

  // Sort by priority score and submission date
  return list.sort((a, b) => b.priority.score - a.priority.score);
}

export function getChallengeById(id: string): Challenge | undefined {
  const db = readDb();
  return db.challenges.find((c) => c.id === id);
}

export function createChallenge(newChallenge: Challenge): Challenge {
  const db = readDb();
  db.challenges.unshift(newChallenge);

  // Add audit log
  db.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    challengeId: newChallenge.id,
    timestamp: new Date().toISOString(),
    actorRole: 'citizen',
    actorName: newChallenge.submittedBy.name || 'Citizen Contributor',
    action: 'CHALLENGE_SUBMITTED',
    details: `Reported issue in ${newChallenge.district} (${newChallenge.category}). Priority assessed as ${newChallenge.priority.level}.`,
  });

  // Notify government
  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    targetRole: 'government',
    title: `New Challenge in ${newChallenge.district}`,
    message: `${newChallenge.title} reported with ${newChallenge.priority.level} priority score.`,
    timestamp: new Date().toISOString(),
    read: false,
    linkUrl: `/challenges/${newChallenge.id}`,
    type: 'ALERT',
  });

  writeDb(db);
  return newChallenge;
}

export function updateChallenge(
  id: string,
  updates: Partial<Challenge>,
  actor?: { role: string; name: string; actionDescription?: string }
): Challenge | undefined {
  const db = readDb();
  const index = db.challenges.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  const prevStatus = db.challenges[index].status;
  db.challenges[index] = {
    ...db.challenges[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (actor) {
    db.auditLogs.unshift({
      id: `LOG-${Date.now()}`,
      challengeId: id,
      timestamp: new Date().toISOString(),
      actorRole: actor.role as any,
      actorName: actor.name,
      action: updates.status ? `STATUS_UPDATED_TO_${updates.status.toUpperCase().replace(/\s+/g, '_')}` : 'CHALLENGE_UPDATED',
      details: actor.actionDescription || `Status changed from ${prevStatus} to ${updates.status || 'updated'}.`,
    });
  }

  writeDb(db);
  return db.challenges[index];
}

export function supportChallenge(
  id: string,
  userId: string,
  userName: string = 'Concerned Citizen'
): Challenge | undefined {
  const db = readDb();
  const index = db.challenges.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  const ch = db.challenges[index];
  ch.communitySupport.supportersCount += 1;
  ch.communitySupport.hasUserSupported = true;

  // Add audit log
  db.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    challengeId: id,
    timestamp: new Date().toISOString(),
    actorRole: 'citizen',
    actorName: userName,
    action: 'COMMUNITY_SUPPORT_ADDED',
    details: `${userName} supported this societal challenge. Total supporters reached ${ch.communitySupport.supportersCount}.`,
  });

  writeDb(db);
  return ch;
}

// Project Operations
export function getProjects(filters?: { district?: string; stage?: string; universityId?: string }): Project[] {
  const db = readDb();
  let list = db.projects;
  if (filters) {
    if (filters.district && filters.district !== 'All') {
      list = list.filter((p) => p.district.toLowerCase() === filters.district!.toLowerCase());
    }
    if (filters.stage && filters.stage !== 'All') {
      list = list.filter((p) => p.stage === filters.stage);
    }
    if (filters.universityId) {
      list = list.filter((p) => p.universityId === filters.universityId);
    }
  }
  return list;
}

export function getProjectById(id: string): Project | undefined {
  const db = readDb();
  return db.projects.find((p) => p.id === id);
}

export function createProject(project: Project): Project {
  const db = readDb();
  db.projects.unshift(project);

  // Link to challenge
  const challenge = db.challenges.find((c) => c.id === project.challengeId);
  if (challenge) {
    challenge.projectId = project.id;
    challenge.status = 'Solution Development';
  }

  // Audit log
  db.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    challengeId: project.challengeId,
    timestamp: new Date().toISOString(),
    actorRole: 'university',
    actorName: project.universityName,
    action: 'PROJECT_INITIALIZED',
    details: `Multidisciplinary team initialized under ${project.facultyMentor.name}. Solution proposal: "${project.title}".`,
  });

  writeDb(db);
  return project;
}

export function updateProject(id: string, updates: Partial<Project>): Project | undefined {
  const db = readDb();
  const index = db.projects.findIndex((p) => p.id === id);
  if (index === -1) return undefined;

  db.projects[index] = {
    ...db.projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  writeDb(db);
  return db.projects[index];
}

// Universities & Matching
export function getUniversities(): University[] {
  const db = readDb();
  return db.universities;
}

export function getStartups(): Startup[] {
  const db = readDb();
  return db.startups;
}

// Leaderboard
export function getLeaderboard(district?: string): LeaderboardUser[] {
  const db = readDb();
  let list = db.leaderboard;
  if (district && district !== 'All') {
    list = list.filter((u) => u.district.toLowerCase() === district.toLowerCase());
  }
  return list.sort((a, b) => b.impactScore - a.impactScore);
}

// Audit Logs
export function getAuditLogs(challengeId?: string): AuditLogEntry[] {
  const db = readDb();
  if (challengeId) {
    return db.auditLogs.filter((log) => log.challengeId === challengeId);
  }
  return db.auditLogs;
}

// Notifications
export function getNotifications(role?: string): NotificationItem[] {
  const db = readDb();
  if (role) {
    return db.notifications.filter((n) => n.targetRole === role || n.targetRole === 'citizen');
  }
  return db.notifications;
}

// Analytics
export function getAnalytics() {
  const db = readDb();
  const challenges = db.challenges;
  const projects = db.projects;

  const totalChallenges = challenges.length;
  const pendingVerification = challenges.filter((c) => c.status === 'Submitted' || c.status === 'Under Review').length;
  const verified = challenges.filter((c) => c.status === 'Verified' || c.status === 'Routed' || c.status === 'Accepted').length;
  const highPriority = challenges.filter((c) => c.priority.level === 'HIGH' || c.priority.level === 'CRITICAL').length;
  const inProgress = projects.filter((p) => p.stage !== 'Completed' && p.stage !== 'Impact Validation').length;
  const completed = projects.filter((p) => p.stage === 'Completed' || p.stage === 'Impact Validation').length;

  const totalPeopleBenefited = projects.reduce((acc, p) => acc + (p.impactMetrics?.peopleBenefited || 0), 48500);

  // Category counts
  const categoryCounts: Record<string, number> = {};
  challenges.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  // District challenge density
  const districtCounts: Record<string, { challenges: number; verified: number; activeProjects: number }> = {};
  JHARKHAND_DISTRICTS.forEach((d) => {
    districtCounts[d.name] = {
      challenges: d.challengesCount,
      verified: Math.floor(d.challengesCount * 0.7),
      activeProjects: d.activeProjects,
    };
  });
  // Augment with current db challenges
  challenges.forEach((c) => {
    if (districtCounts[c.district]) {
      districtCounts[c.district].challenges += 1;
    }
  });

  return {
    kpis: {
      totalChallenges,
      pendingVerification,
      verified,
      highPriority,
      inProgress,
      completed,
      solutionsDeployed: completed + 8,
      citizensParticipating: 3420,
      totalPeopleBenefited,
      universitiesParticipating: db.universities.length,
      startupsParticipating: db.startups.length,
    },
    categoryDistribution: Object.entries(categoryCounts).map(([name, count]) => ({ name, count })),
    districtDensity: districtCounts,
    districtsList: JHARKHAND_DISTRICTS,
  };
}
