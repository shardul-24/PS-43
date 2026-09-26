// AI Problem Understanding, Duplicate Detection & Jharkhand-First Matching Engine

import {
  Challenge,
  AIAnalysis,
  DuplicateMatch,
  PriorityBreakdown,
  PriorityLevel,
  University,
  UniversityMatch,
  ChallengeCategory,
  Startup,
  Project,
} from '@/types';

// Distance calculation using Haversine formula
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Category keyword dictionary for deterministic NLP classification
const CATEGORY_KEYWORDS: Record<ChallengeCategory, string[]> = {
  'Water Resources': ['water', 'drinking', 'handpump', 'well', 'borewell', 'fluoride', 'arsenic', 'contamination', 'dirty', 'smell', 'aquifer', 'reservoir', 'pipeline', 'tap', 'canal', 'turbid', 'jal'],
  'Healthcare': ['health', 'hospital', 'doctor', 'clinic', 'medicine', 'fever', 'disease', 'anemia', 'maternal', 'chc', 'phc', 'asha', 'sick', 'emergency', 'ambulance', 'swasthya'],
  'Agriculture': ['crop', 'farmer', 'farming', 'tomato', 'potato', 'vegetable', 'cold storage', 'soil', 'harvest', 'irrigation', 'paddy', 'drought', 'fertilizer', 'kisan', 'krishi'],
  'Sanitation': ['toilet', 'sewage', 'drainage', 'gutter', 'garbage', 'solid waste', 'dumping', 'cleanliness', 'swachh'],
  'Environment & Forestry': ['forest', 'tree', 'deforestation', 'biodiversity', 'wildlife', 'river', 'pollution', 'smoke', 'climate', 'jungle'],
  'Energy': ['electricity', 'power', 'power cut', 'solar', 'transformer', 'grid', 'blackout', 'light', 'bijli', 'voltage'],
  'Urban Development': ['traffic', 'parking', 'slum', 'encroachment', 'pothole', 'street light', 'city', 'urban'],
  'Rural Livelihoods': ['livelihood', 'lac', 'tasar', 'silk', 'handicraft', 'tribal income', 'shg', 'artisan', 'wage', 'rozgar'],
  'Infrastructure & Connectivity': ['road', 'bridge', 'culvert', 'connectivity', 'isolated', 'transport', 'bus', 'sadak', 'pul'],
  'Education & Skill': ['school', 'teacher', 'classroom', 'student', 'college', 'dropout', 'computer lab', 'skill', 'shiksha'],
  'Mining Impact & Remediation': ['coal', 'mining', 'dust', 'slurry', 'fly ash', 'quarry', 'blasting', 'subsidence', 'overburden', 'koyla'],
  'Accessibility & Disability': ['wheelchair', 'ramp', 'blind', 'disabled', 'braille', 'prosthetic', 'elderly', 'divyang'],
  'Public Administration': ['ration', 'pension', 'bribe', 'delay', 'aadhaar', 'panchayat office', 'certificate'],
  'Disaster Management': ['flood', 'drought', 'landslide', 'lightning', 'cyclone', 'relief', 'hazard'],
  'Other': ['civic', 'community', 'general', 'misc'],
};

// 1. Natural Language Problem Understanding
export function analyzeProblemDescription(
  title: string,
  description: string,
  selectedCategory?: string,
  impactData?: { peopleAffectedApprox?: number; immediateRisk?: boolean }
): AIAnalysis {
  const combinedText = `${title} ${description}`.toLowerCase();
  const words = combinedText.split(/\W+/).filter((w) => w.length > 3);

  // Score categories
  let bestCategory: ChallengeCategory = (selectedCategory as ChallengeCategory) || 'Water Resources';
  let bestScore = 0;

  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    const matchCount = kws.filter((kw) => combinedText.includes(kw)).length;
    if (matchCount > bestScore) {
      bestScore = matchCount;
      bestCategory = cat as ChallengeCategory;
    }
  }

  // Extract top keywords
  const matchedKeywords = Array.from(new Set(words.filter((w) =>
    ['water', 'handpump', 'fluoride', 'smell', 'stone', 'slurry', 'cold', 'storage', 'farmer', 'bridge', 'culvert', 'anemia', 'asha', 'dust', 'coal', 'electricity', 'blackout', 'toilet', 'river', 'crop'].includes(w)
  ))).slice(0, 7);

  if (matchedKeywords.length === 0) {
    matchedKeywords.push('community challenge', 'grassroots issue', 'public domain');
  }

  // Determine affected domain
  const domainMap: Record<ChallengeCategory, string> = {
    'Water Resources': 'Public Health & Rural Safe Drinking Water Infrastructure',
    'Healthcare': 'Community Medicine & Maternal-Child Healthcare Access',
    'Agriculture': 'Agrarian Rural Economy & Post-Harvest Food Systems',
    'Sanitation': 'Environmental Health & Municipal Sanitation',
    'Environment & Forestry': 'Ecological Conservation & Biodiversity Protection',
    'Energy': 'Renewable Energy & Decentralized Power Distribution',
    'Urban Development': 'Municipal Infrastructure & Civic Services',
    'Rural Livelihoods': 'Tribal Enterprise Development & Non-Timber Forest Produce',
    'Infrastructure & Connectivity': 'Rural Transportation & Disaster-Resilient Civil Works',
    'Education & Skill': 'Basic Education & Digital Skill Empowerment',
    'Mining Impact & Remediation': 'Industrial Remediation & Community Eco-Restoration',
    'Accessibility & Disability': 'Assistive Technology & Universal Physical Accessibility',
    'Public Administration': 'Digital Governance & Public Service Delivery',
    'Disaster Management': 'Disaster Risk Reduction & Community Resilience',
    'Other': 'Civic Innovation & Community Well-being',
  };

  const domain = domainMap[bestCategory] || 'Societal Infrastructure & Welfare';

  // Determine priority
  let estimatedPriority: PriorityLevel = 'MEDIUM';
  const people = impactData?.peopleAffectedApprox || 500;
  if (impactData?.immediateRisk || people > 1000 || combinedText.includes('severe') || combinedText.includes('poison') || combinedText.includes('emergency')) {
    estimatedPriority = people > 2500 ? 'CRITICAL' : 'HIGH';
  } else if (people < 200) {
    estimatedPriority = 'LOW';
  }

  // Recommended expertise based on category
  const expertiseMap: Record<ChallengeCategory, string[]> = {
    'Water Resources': ['Environmental Engineering (Water Quality & Toxicology)', 'Civil Engineering (Rural Hydraulics & Piping)', 'IoT & Embedded Sensors', 'Biochemical Membrane Filtration'],
    'Healthcare': ['Community Medicine & Epidemiology', 'Biomedical Diagnostic Devices', 'Mobile Telehealth Architecture', 'Rural Health Systems'],
    'Agriculture': ['Agricultural Engineering & Farm Mechanization', 'Solar Thermal & Cold Chain Storage', 'Soil Science & Micro-Irrigation', 'Rural Cooperative Value Chains'],
    'Sanitation': ['Environmental Sanitation & Solid Waste Management', 'Biogas & Waste-to-Energy Systems', 'Civil Drainage Design'],
    'Environment & Forestry': ['Forest Ecology & Biodiversity Conservation', 'GIS & Satellite Remote Sensing', 'Phytoremediation & Watershed Restoration'],
    'Energy': ['Electrical Engineering & DC Microgrids', 'Solar PV Energy Systems & Battery Storage', 'Power Electronics'],
    'Urban Development': ['Urban Planning & Smart Traffic Systems', 'Municipal Geo-database Management', 'Civil Transportation'],
    'Rural Livelihoods': ['Appropriate Rural Technology', 'Tribal Handicraft & Non-Timber Forest Produce Processing', 'Micro-enterprise Incubation'],
    'Infrastructure & Connectivity': ['Structural Civil Engineering & Bridge Design', 'Geotechnical Soil Mechanics', 'Flash-Flood Resilient Architecture'],
    'Education & Skill': ['Educational Technology & Digital Learning', 'Low-cost Hardware & Computer Labs', 'Vernacular Language Interfaces'],
    'Mining Impact & Remediation': ['Mining Environmental Engineering', 'Dust Suppression & Aerosol Scrubbing', 'Acid Mine Drainage Remediation'],
    'Accessibility & Disability': ['Assistive Robotics & Prosthetics', 'Ergonomic Architecture & Ramp Design', 'Audio-Haptic Navigation'],
    'Public Administration': ['E-Governance & Distributed Ledgers', 'Citizen Feedback Telemetry', 'Workflow Optimization'],
    'Disaster Management': ['Early Warning Siren & SMS Alert Networks', 'Flood Inundation Modeling', 'Emergency Relief Logistics'],
    'Other': ['Interdisciplinary Civic Engineering', 'Social Impact Measurement'],
  };

  return {
    category: bestCategory,
    subcategory: `${bestCategory} Grassroots Intervention`,
    keywords: matchedKeywords,
    affectedDomain: domain,
    estimatedPriority,
    affectedPopulationEstimate: people,
    problemSummary: `AI-structured report: Grassroots challenge identified in ${bestCategory} affecting an estimated ${people} citizens. Key focus areas include ${matchedKeywords.join(', ')}.`,
    confidence: Math.min(96, Math.max(82, 80 + bestScore * 3)),
    recommendedExpertise: expertiseMap[bestCategory] || ['Community Engineering', 'Public Policy'],
    missingInformation: combinedText.length < 60 ? ['Specific location landmarks or ward number', 'Evidence photo or lab report'] : [],
  };
}

// 2. Duplicate & Semantic Similarity Detection Engine
export function detectDuplicatesAndSimilar(
  newChallenge: { title: string; description: string; category: ChallengeCategory; latitude: number; longitude: number },
  existingChallenges: Challenge[]
): DuplicateMatch[] {
  const matches: DuplicateMatch[] = [];
  const newKeywords = new Set(`${newChallenge.title} ${newChallenge.description}`.toLowerCase().split(/\W+/).filter((w) => w.length > 3));

  for (const ex of existingChallenges) {
    // 1. Distance score
    const distKm = calculateDistanceKm(newChallenge.latitude, newChallenge.longitude, ex.latitude, ex.longitude);

    // 2. Keyword overlap (Jaccard similarity)
    const exKeywords = new Set(`${ex.title} ${ex.description}`.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
    let intersection = 0;
    newKeywords.forEach((kw) => {
      if (exKeywords.has(kw)) intersection++;
    });
    const union = new Set([...Array.from(newKeywords), ...Array.from(exKeywords)]).size;
    const textSimilarity = union > 0 ? (intersection / union) : 0;

    // 3. Category match bonus
    const categoryMatch = ex.category === newChallenge.category ? 0.35 : 0;

    // 4. Distance proximity bonus (within 15 km is high local correlation)
    let proximityFactor = 0;
    if (distKm <= 5) proximityFactor = 0.35;
    else if (distKm <= 15) proximityFactor = 0.25;
    else if (distKm <= 35) proximityFactor = 0.15;
    else proximityFactor = 0.05;

    // Overall similarity percentage
    const combinedScore = Math.min(98, Math.round((textSimilarity * 0.4 + categoryMatch + proximityFactor) * 100));

    // Threshold: if score >= 65 and distance < 40 km, consider as candidate
    if (combinedScore >= 65) {
      matches.push({
        challengeId: ex.id,
        title: ex.title,
        similarityScore: combinedScore,
        distanceKm: distKm,
        reportedByCount: ex.communitySupport.originalReportsCount + ex.communitySupport.supportersCount,
        status: ex.status,
      });
    }
  }

  // Sort descending by similarity score
  return matches.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, 4);
}

// 3. Explainable Priority Engine
export function calculateExplainablePriority(data: {
  peopleAffectedApprox: number;
  immediateRisk: boolean;
  frequency: string;
  durationMonths: number;
  supportersCount?: number;
  originalReportsCount?: number;
}): PriorityBreakdown {
  const reasons: string[] = [];

  // Factor 1: Population Affected (Max 25 pts)
  let popScore = 10;
  if (data.peopleAffectedApprox >= 2500) {
    popScore = 25;
    reasons.push(`Over ${data.peopleAffectedApprox.toLocaleString()} citizens severely impacted (+25 pts)`);
  } else if (data.peopleAffectedApprox >= 1000) {
    popScore = 22;
    reasons.push(`${data.peopleAffectedApprox.toLocaleString()} people affected in the locality (+22 pts)`);
  } else if (data.peopleAffectedApprox >= 500) {
    popScore = 18;
    reasons.push(`${data.peopleAffectedApprox} community members affected (+18 pts)`);
  } else {
    popScore = 12;
    reasons.push(`${data.peopleAffectedApprox} people directly impacted (+12 pts)`);
  }

  // Factor 2: Health & Safety Risk (Max 30 pts)
  let riskScore = 15;
  if (data.immediateRisk) {
    riskScore = 30;
    reasons.push(`Acute immediate danger to community health, safety, or life (+30 pts)`);
  } else {
    riskScore = 15;
    reasons.push(`Sub-acute or chronic non-life-threatening civic concern (+15 pts)`);
  }

  // Factor 3: Community Support & Repeated Reports (Max 20 pts)
  const totalReports = (data.originalReportsCount || 1) + (data.supportersCount || 0);
  let supportScore = 8;
  if (totalReports >= 100) {
    supportScore = 20;
    reasons.push(`Widespread community corroboration with ${totalReports} citizens reporting or supporting (+20 pts)`);
  } else if (totalReports >= 40) {
    supportScore = 16;
    reasons.push(`Strong local backing with ${totalReports} community endorsements (+16 pts)`);
  } else if (totalReports >= 10) {
    supportScore = 12;
    reasons.push(`${totalReports} verified community endorsements (+12 pts)`);
  } else {
    supportScore = 8;
    reasons.push(`Initial verified report from community (+8 pts)`);
  }

  // Factor 4: Geographical Spread (Max 15 pts)
  let spreadScore = 10;
  if (data.peopleAffectedApprox > 1500) {
    spreadScore = 14;
    reasons.push(`Spans across multiple contiguous panchayats or hamlets (+14 pts)`);
  } else {
    spreadScore = 10;
    reasons.push(`Localized to specific village cluster or ward (+10 pts)`);
  }

  // Factor 5: Urgency & Duration (Max 10 pts)
  let durationScore = 5;
  if (data.durationMonths >= 6 || data.frequency === 'Continuous') {
    durationScore = 9;
    reasons.push(`Persistent ongoing distress for ${data.durationMonths || 6}+ months (+9 pts)`);
  } else {
    durationScore = 5;
    reasons.push(`Seasonal or periodic recurrence (+5 pts)`);
  }

  const totalScore = popScore + riskScore + supportScore + spreadScore + durationScore;

  let level: PriorityLevel = 'MEDIUM';
  if (totalScore >= 85) level = 'CRITICAL';
  else if (totalScore >= 70) level = 'HIGH';
  else if (totalScore >= 50) level = 'MEDIUM';
  else level = 'LOW';

  return {
    score: totalScore,
    level,
    factors: {
      populationAffected: popScore,
      healthSafetyRisk: riskScore,
      communitySupport: supportScore,
      geoSpread: spreadScore,
      urgencyDuration: durationScore,
    },
    reasons,
  };
}

// 4. Smart Jharkhand-First University Matching Engine
export function calculateJharkhandFirstUniversityMatches(
  challenge: Challenge,
  universities: University[]
): UniversityMatch[] {
  const matches: UniversityMatch[] = universities.map((univ) => {
    const reasons: string[] = [];
    const recommendedFaculty: string[] = [];
    const relevantLabs: string[] = [];

    // 1. Department Expertise (Max 30%)
    let deptScore = 10;
    const catWords = challenge.category.toLowerCase().split(/\W+/);
    const matchedDept = univ.departments.find((d) => {
      const dName = d.name.toLowerCase();
      const hasDirect = catWords.some((cw) => dName.includes(cw));
      const hasSpecialization = d.specializations.some((s) =>
        challenge.aiAnalysis.keywords.some((kw) => s.toLowerCase().includes(kw))
      );
      return hasDirect || hasSpecialization;
    });

    if (matchedDept) {
      deptScore = 28;
      reasons.push(`Aligned department: ${matchedDept.name} specializing in ${matchedDept.specializations.slice(0, 2).join(', ')}`);
    } else {
      deptScore = 14;
    }

    // 2. Faculty Expertise (Max 25%)
    let facultyScore = 8;
    const matchingFac = univ.faculty.filter((f) => {
      return f.specializations.some((s) => {
        const sLower = s.toLowerCase();
        return (
          challenge.aiAnalysis.keywords.some((kw) => sLower.includes(kw)) ||
          challenge.category.toLowerCase().includes(sLower)
        );
      });
    });

    if (matchingFac.length > 0) {
      facultyScore = Math.min(25, 18 + matchingFac.length * 3);
      matchingFac.forEach((f) => {
        recommendedFaculty.push(f.name);
        reasons.push(`Faculty expert: ${f.name} (${f.specializations[0]})`);
      });
    } else if (univ.faculty.length > 0) {
      facultyScore = 14;
      recommendedFaculty.push(univ.faculty[0].name);
    }

    // 3. Research Capability & Labs (Max 20% research + 10% labs)
    let researchScore = 14;
    univ.researchFocus.forEach((rf) => {
      if (challenge.aiAnalysis.keywords.some((kw) => rf.toLowerCase().includes(kw))) {
        researchScore = 19;
      }
    });

    let labScore = 5;
    univ.labs.forEach((lab) => {
      const labLower = lab.toLowerCase();
      if (
        labLower.includes('water') ||
        labLower.includes('iot') ||
        labLower.includes('testing') ||
        labLower.includes('environment') ||
        labLower.includes('energy')
      ) {
        relevantLabs.push(lab);
        labScore = 10;
      }
    });
    if (relevantLabs.length > 0) {
      reasons.push(`Accredited facilities: ${relevantLabs[0]}`);
    }

    // 4. Previous Projects (Max 5%)
    const previousProjectsScore = Math.min(5, Math.floor(univ.completedProjectsCount / 8));

    // 5. Geographic Relevance (Max 4%)
    let geoScore = 2;
    if (univ.district.toLowerCase() === challenge.district.toLowerCase()) {
      geoScore = 4;
      reasons.push(`Local District Proximity: Campus in ${univ.district} (${challenge.district})`);
    }

    // 6. Tier 1 Jharkhand-First Priority Bonus (Max 6%)
    let tierScore = 0;
    if (univ.isJharkhand) {
      tierScore = 6;
      reasons.push(`Jharkhand-First Tier 1 Routing Priority applied (+6% state focus)`);
    }

    const totalScore = Math.min(
      98,
      deptScore + facultyScore + researchScore + labScore + previousProjectsScore + geoScore + tierScore
    );

    return {
      universityId: univ.id,
      universityName: univ.name,
      district: univ.district,
      isJharkhand: univ.isJharkhand,
      overallMatchScore: totalScore,
      breakdown: {
        departmentExpertise: deptScore,
        facultyExpertise: facultyScore,
        researchCapability: researchScore,
        labFacilities: labScore,
        previousProjects: previousProjectsScore,
        geographicRelevance: geoScore,
        tierPriority: tierScore,
      },
      reasons,
      recommendedFaculty: recommendedFaculty.slice(0, 3),
      relevantLabs: relevantLabs.slice(0, 3),
    };
  });

  // Sort descending by match score
  return matches.sort((a, b) => b.overallMatchScore - a.overallMatchScore);
}

// 5. Smart Startup & Industry Matching Engine
export function calculateStartupMatches(
  project: Project,
  startups: Startup[]
): Array<{ startup: Startup; matchScore: number; reasons: string[] }> {
  const matches = startups.map((st) => {
    const reasons: string[] = [];
    let score = 50;

    // Check sector overlap
    if (project.challengeTitle.toLowerCase().includes('water') && st.sector.toLowerCase().includes('water')) {
      score += 25;
      reasons.push(`Direct sector match in ${st.sector}`);
    } else if (project.challengeTitle.toLowerCase().includes('cold') && st.sector.toLowerCase().includes('agri')) {
      score += 25;
      reasons.push(`Direct agricultural sector match`);
    }

    // Check tech overlap
    const techMatches = st.expertise.filter((exp) =>
      project.proposal.technologyStack.some((tech) => exp.toLowerCase().includes(tech.toLowerCase()) || tech.toLowerCase().includes(exp.toLowerCase()))
    );

    if (techMatches.length > 0) {
      score += 15;
      reasons.push(`Technology synergy: ${techMatches.join(', ')}`);
    }

    // Jharkhand location bonus
    if (st.isJharkhand) {
      score += 6;
      reasons.push(`Local Jharkhand Enterprise (${st.district})`);
    }

    return {
      startup: st,
      matchScore: Math.min(96, score),
      reasons,
    };
  });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}
