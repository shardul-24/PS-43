// Types for SIH 2026 PS26043 - Samadhan Sangam

export type Role = 'citizen' | 'government' | 'university' | 'startup';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  district?: string;
  organization?: string;
  avatar?: string;
  impactScore?: number;
  rankTitle?: string;
}

export type ChallengeCategory =
  | 'Water Resources'
  | 'Healthcare'
  | 'Agriculture'
  | 'Sanitation'
  | 'Environment & Forestry'
  | 'Energy'
  | 'Urban Development'
  | 'Rural Livelihoods'
  | 'Infrastructure & Connectivity'
  | 'Education & Skill'
  | 'Mining Impact & Remediation'
  | 'Accessibility & Disability'
  | 'Public Administration'
  | 'Disaster Management'
  | 'Other';

export type ChallengeStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Needs Information'
  | 'Duplicate'
  | 'Routed'
  | 'Accepted'
  | 'Solution Development'
  | 'Pilot'
  | 'Implemented'
  | 'Impact Measured'
  | 'Closed';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface PriorityBreakdown {
  score: number; // 0 - 100
  level: PriorityLevel;
  factors: {
    populationAffected: number; // e.g. 25
    healthSafetyRisk: number; // e.g. 30
    communitySupport: number; // e.g. 20
    geoSpread: number; // e.g. 15
    urgencyDuration: number; // e.g. 10
  };
  reasons: string[];
}

export interface AIAnalysis {
  category: ChallengeCategory;
  subcategory: string;
  keywords: string[];
  affectedDomain: string;
  estimatedPriority: PriorityLevel;
  affectedPopulationEstimate: number;
  problemSummary: string;
  confidence: number; // 0 - 100
  recommendedExpertise: string[];
  missingInformation?: string[];
}

export interface DuplicateMatch {
  challengeId: string;
  title: string;
  similarityScore: number; // 0 - 100
  distanceKm: number;
  reportedByCount: number;
  status: ChallengeStatus;
}

export interface CommunitySupport {
  originalReportsCount: number;
  supportersCount: number;
  followersCount: number;
  evidenceContributorsCount: number;
  hasUserSupported?: boolean;
  hasUserFollowed?: boolean;
}

export interface EvidenceMedia {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  caption?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Challenge {
  id: string; // e.g. "CH-1024"
  title: string;
  description: string;
  category: ChallengeCategory;
  subcategory?: string;
  district: string;
  block: string;
  villageOrCity: string;
  latitude: number;
  longitude: number;
  submittedBy: {
    id: string;
    name: string;
    district: string;
    isAnonymous?: boolean;
  };
  submittedAt: string;
  status: ChallengeStatus;
  priority: PriorityBreakdown;
  aiAnalysis: AIAnalysis;
  similarChallenges?: DuplicateMatch[];
  duplicateOfId?: string; // If merged
  communitySupport: CommunitySupport;
  evidence: EvidenceMedia[];
  impactQuestions: {
    peopleAffectedApprox: number;
    frequency: 'Continuous' | 'Daily' | 'Weekly' | 'Seasonal' | 'Occasional';
    durationMonths: number;
    immediateRisk: boolean;
    affectsPublicServices: boolean;
  };
  assignedDepartment?: string;
  assignedUniversityId?: string;
  assignedUniversityName?: string;
  matchedUniversities?: UniversityMatch[];
  projectId?: string;
  updatedAt: string;
}

export interface UniversityDepartment {
  name: string;
  hodName: string;
  facultyCount: number;
  specializations: string[];
}

export interface FacultyMember {
  id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  specializations: string[];
  patentsCount?: number;
  completedProjectsCount: number;
}

export interface UniversityMatch {
  universityId: string;
  universityName: string;
  district: string;
  isJharkhand: boolean; // Tier 1 vs Tier 2
  overallMatchScore: number; // 0 - 100
  breakdown: {
    departmentExpertise: number; // 30% max
    facultyExpertise: number; // 25% max
    researchCapability: number; // 20% max
    labFacilities: number; // 10% max
    previousProjects: number; // 5% max
    geographicRelevance: number; // 4% max
    tierPriority: number; // 6% max
  };
  reasons: string[];
  recommendedFaculty: string[];
  relevantLabs: string[];
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  district: string;
  state: string;
  isJharkhand: boolean; // Tier 1
  type: 'Central University' | 'State University' | 'Institute of National Importance' | 'Deemed' | 'Private';
  departments: UniversityDepartment[];
  faculty: FacultyMember[];
  labs: string[];
  incubationCenter?: string;
  researchFocus: string[];
  activeProjectsCount: number;
  completedProjectsCount: number;
  rating: number;
}

export type CollaborationType =
  | 'Mentorship'
  | 'Funding'
  | 'Technology'
  | 'Prototype Development'
  | 'Testing & Certification'
  | 'Pilot Deployment'
  | 'Manufacturing'
  | 'Distribution & Scale';

export interface Startup {
  id: string;
  name: string;
  district: string;
  state: string;
  isJharkhand: boolean;
  sector: string;
  expertise: string[];
  availableOfferings: CollaborationType[];
  teamSize: number;
  fundingStage: 'Bootstrapped' | 'Seed' | 'Series A' | 'CSR Partner' | 'Govt Supported MSME';
  website?: string;
  activeCollaborationsCount: number;
  description: string;
}

export type ProjectStage =
  | 'Idea'
  | 'Proposal'
  | 'Approved'
  | 'Prototype'
  | 'Testing'
  | 'Pilot'
  | 'Deployment'
  | 'Completed'
  | 'Impact Validation';

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  progressPercent: number; // 0 - 100
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  deadline: string;
  completedAt?: string;
  responsibleLead: string;
  deliverables?: string[];
  proofDocuments?: string[];
}

export interface StudentTeamMember {
  name: string;
  department: string;
  year: string;
  rollNumber?: string;
  roleInProject: string;
}

export interface SolutionProposal {
  problemUnderstanding: string;
  proposedSolution: string;
  technologyStack: string[];
  expectedImpact: string;
  estimatedCostInr: number;
  timelineMonths: number;
  prototypeDescription: string;
  submittedAt: string;
  approvedByGovernment?: boolean;
  approvedAt?: string;
}

export interface IndustryCollaboration {
  id: string;
  startupId: string;
  startupName: string;
  types: CollaborationType[];
  contributionDetails: string;
  fundingCommittedInr?: number;
  status: 'PROPOSED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'ACTIVE' | 'COMPLETED';
  offeredAt: string;
  acceptedAt?: string;
}

export interface SocialImpactMetrics {
  peopleBenefited: number;
  villagesCovered: number;
  costSavedInr?: number;
  timeSavedDescription?: string;
  healthSafetyImprovementPercent?: number;
  environmentalReductionPercent?: number;
  beforeCondition: string;
  afterCondition: string;
  impactScore: number;
  verifiedByAuthority?: string;
}

export interface Project {
  id: string; // e.g. "PRJ-301"
  challengeId: string;
  challengeTitle: string;
  title: string;
  district: string;
  universityId: string;
  universityName: string;
  facultyMentor: FacultyMember;
  students: StudentTeamMember[];
  proposal: SolutionProposal;
  stage: ProjectStage;
  milestones: ProjectMilestone[];
  collaborations: IndustryCollaboration[];
  impactMetrics?: SocialImpactMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface CitizenImpactScoreBreakdown {
  totalScore: number;
  rankTitle: 'Community Contributor' | 'Community Champion' | 'Impact Leader' | 'Civic Innovator';
  verifiedReports: number; // +180
  communitySupportReceived: number; // +220
  evidenceQuality: number; // +120
  impactContribution: number; // +150
  engagementScore: number; // +72
}

export interface LeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  district: string;
  verifiedReportsCount: number;
  peopleSupportedCount: number;
  impactScore: number;
  rankBadge: string;
}

export interface AuditLogEntry {
  id: string;
  challengeId: string;
  timestamp: string;
  actorRole: Role | 'System';
  actorName: string;
  action: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  targetRole: Role;
  userId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkUrl: string;
  type: 'VERIFICATION' | 'ROUTING' | 'ACCEPTANCE' | 'COLLABORATION' | 'MILESTONE' | 'ALERT';
}
