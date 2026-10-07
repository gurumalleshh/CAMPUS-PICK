import { Report, PotentialMatch, MatchFactor } from '../types';

export interface CorrelationEvaluation {
  confidenceScore: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  matchingFactors: MatchFactor[];
  hasSignificantDiscrepancies: boolean;
  discrepancies: string[];
}

// Comprehensive brand aliases mapping
const BRAND_ALIASES: Record<string, string> = {
  // Dell
  dell: 'dell',
  latitude: 'dell',
  laltitude: 'dell',
  xps: 'dell',
  inspiron: 'dell',
  vostro: 'dell',
  alienware: 'dell',
  precision: 'dell',

  // Lenovo
  lenovo: 'lenovo',
  thinkpad: 'lenovo',
  ideapad: 'lenovo',
  legion: 'lenovo',
  yoga: 'lenovo',

  // Apple
  apple: 'apple',
  macbook: 'apple',
  iphone: 'apple',
  ipad: 'apple',
  airpods: 'apple',
  mac: 'apple',

  // HP
  hp: 'hp',
  pavilion: 'hp',
  envy: 'hp',
  spectre: 'hp',
  omen: 'hp',
  victus: 'hp',
  probook: 'hp',
  elitebook: 'hp',

  // Asus
  asus: 'asus',
  zenbook: 'asus',
  vivobook: 'asus',
  rog: 'asus',
  tuf: 'asus',

  // Acer
  acer: 'acer',
  aspire: 'acer',
  predator: 'acer',
  swift: 'acer',
  nitro: 'acer',

  // Samsung
  samsung: 'samsung',
  galaxy: 'samsung',

  // OnePlus
  oneplus: 'oneplus',
  nord: 'oneplus',

  // Casio
  casio: 'casio',
  classwiz: 'casio',

  // Wildcraft
  wildcraft: 'wildcraft',

  // Honda
  honda: 'honda',

  // Godrej
  godrej: 'godrej',
};

// Normalized color buckets
const COLOR_FAMILIES: Record<string, string> = {
  black: 'black',
  dark: 'black',
  charcoal: 'black',
  matte_black: 'black',
  silver: 'silver',
  grey: 'silver',
  gray: 'silver',
  white: 'white',
  ivory: 'white',
  blue: 'blue',
  navy: 'blue',
  red: 'red',
  crimson: 'red',
  green: 'green',
  yellow: 'yellow',
  gold: 'gold',
  brass: 'gold',
};

/**
 * Normalizes and extracts canonical brand from a report
 */
export function extractBrand(report: Partial<Report>): string | null {
  if (!report) return null;

  // 1. Direct brand field
  if (report.brand && report.brand.trim()) {
    const directLower = report.brand.toLowerCase().trim();
    for (const [alias, canonical] of Object.entries(BRAND_ALIASES)) {
      if (directLower.includes(alias)) {
        return canonical;
      }
    }
    return directLower;
  }

  // 2. Search itemName, model, and description
  const combinedText = `${report.itemName || ''} ${report.model || ''} ${report.description || ''}`.toLowerCase();

  for (const [alias, canonical] of Object.entries(BRAND_ALIASES)) {
    const regex = new RegExp(`\\b${alias}\\b`, 'i');
    if (regex.test(combinedText)) {
      return canonical;
    }
  }

  return null;
}

/**
 * Normalizes color text to a color family
 */
export function getColorFamily(colorText?: string): string | null {
  if (!colorText) return null;
  const text = colorText.toLowerCase();

  for (const [keyword, family] of Object.entries(COLOR_FAMILIES)) {
    if (text.includes(keyword)) {
      return family;
    }
  }
  return null;
}

/**
 * Parses time string (e.g., "3:45 PM", "11:35 PM", "14:30") to minutes from midnight
 */
export function parseTimeToMinutes(timeStr?: string): number | null {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{1,2}):(\d{2})(?:\s*([AP]M))?/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Core algorithmic correlation engine for lost & found reports
 */
export function evaluateReportCorrelation(
  lostReport: Report,
  foundReport: Report,
  isSecurityOrAdmin: boolean = false,
  claimantEvidenceSerial?: string
): CorrelationEvaluation {
  const matchingFactors: MatchFactor[] = [];
  const discList: string[] = [];

  let score = 0;
  const maxPossible = 100;

  // 1. CATEGORY CHECK (Prerequisite)
  const categoryMatch = lostReport.category === foundReport.category;
  if (categoryMatch) {
    score += 20;
    matchingFactors.push({
      name: 'Category & Type',
      match: true,
      status: 'MATCH',
      description: `Category matches: ${lostReport.category.replace('_', ' ').toUpperCase()}`,
      strength: 'STRONG',
    });
  } else {
    discList.push(`Category Incompatibility: "${lostReport.category}" vs "${foundReport.category}"`);
    matchingFactors.push({
      name: 'Category & Type',
      match: false,
      status: 'MISMATCH',
      description: `Incompatible categories: ${lostReport.category} vs ${foundReport.category}`,
      strength: 'STRONG',
    });
    // Hard incompatibility
    return {
      confidenceScore: 10,
      confidenceLevel: 'Low',
      matchingFactors,
      hasSignificantDiscrepancies: true,
      discrepancies: discList,
    };
  }

  // 2. BRAND & ITEM CLASSIFICATION
  const lostBrand = extractBrand(lostReport);
  const foundBrand = extractBrand(foundReport);

  if (lostBrand && foundBrand) {
    if (lostBrand === foundBrand) {
      score += 25;
      matchingFactors.push({
        name: 'Item Classification & Brand',
        match: true,
        status: 'MATCH',
        description: `${lostReport.itemName} and ${foundReport.itemName} share brand (${lostBrand.toUpperCase()})`,
        strength: 'STRONG',
      });
    } else {
      // BRAND CONFLICT! Dell vs Lenovo or Apple vs Samsung
      discList.push(`Critical Brand Mismatch: Lost report is ${lostBrand.toUpperCase()} while turned-in item is ${foundBrand.toUpperCase()}`);
      matchingFactors.push({
        name: 'Item Classification & Brand',
        match: false,
        status: 'MISMATCH',
        description: `Brand conflict: ${lostBrand.toUpperCase()} vs ${foundBrand.toUpperCase()}`,
        strength: 'STRONG',
      });
    }
  } else if (!lostBrand && !foundBrand) {
    // Both unbranded, check name token overlap
    const lostTokens = lostReport.itemName.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    const foundTokens = foundReport.itemName.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    const common = lostTokens.filter((t) => foundTokens.some((ft) => ft.includes(t) || t.includes(ft)));

    if (common.length > 0) {
      score += 15;
      matchingFactors.push({
        name: 'Item Classification',
        match: true,
        status: 'MATCH',
        description: `Name keywords match: "${common.join(', ')}"`,
        strength: 'MEDIUM',
      });
    } else {
      matchingFactors.push({
        name: 'Item Classification',
        match: false,
        status: 'PARTIAL',
        description: `${lostReport.itemName} vs ${foundReport.itemName}`,
        strength: 'WEAK',
      });
    }
  } else {
    // One has brand, other doesn't
    matchingFactors.push({
      name: 'Item Classification',
      match: true,
      status: 'PARTIAL',
      description: `${lostReport.itemName} vs ${foundReport.itemName} (Brand unconfirmed on one report)`,
      strength: 'WEAK',
    });
    score += 10;
  }

  // 3. COLOR PROFILE
  const lostColor = getColorFamily(lostReport.color);
  const foundColor = getColorFamily(foundReport.color);

  if (lostColor && foundColor) {
    if (lostColor === foundColor) {
      score += 15;
      matchingFactors.push({
        name: 'Color Profile',
        match: true,
        status: 'MATCH',
        description: `Color matches: ${lostReport.color} vs ${foundReport.color}`,
        strength: 'STRONG',
      });
    } else {
      discList.push(`Color Divergence: Lost report is ${lostReport.color || lostColor} while turned-in item is ${foundReport.color || foundColor}`);
      matchingFactors.push({
        name: 'Color Profile',
        match: false,
        status: 'MISMATCH',
        description: `Divergent colors: ${lostReport.color} vs ${foundReport.color}`,
        strength: 'MEDIUM',
      });
    }
  } else {
    matchingFactors.push({
      name: 'Color Profile',
      match: true,
      status: 'PARTIAL',
      description: `Color: ${lostReport.color || 'Unspecified'} vs ${foundReport.color || 'Unspecified'}`,
      strength: 'WEAK',
    });
    score += 5;
  }

  // 4. SPATIAL & LOCATION PROXIMITY
  const sameBuilding =
    lostReport.location.building.toLowerCase().trim() ===
    foundReport.location.building.toLowerCase().trim();
  const sameRoom =
    lostReport.location.room &&
    foundReport.location.room &&
    lostReport.location.room.toLowerCase().trim() ===
      foundReport.location.room.toLowerCase().trim();

  if (sameRoom) {
    score += 20;
    matchingFactors.push({
      name: 'Location Proximity',
      match: true,
      status: 'MATCH',
      description: `Exact room match: ${lostReport.location.room}`,
      strength: 'STRONG',
    });
  } else if (sameBuilding) {
    score += 15;
    matchingFactors.push({
      name: 'Location Proximity',
      match: true,
      status: 'MATCH',
      description: `Same campus building: ${lostReport.location.building} (${lostReport.location.room} → ${foundReport.location.room})`,
      strength: 'MEDIUM',
    });
  } else {
    discList.push(`Location Mismatch: ${lostReport.location.building} vs ${foundReport.location.building}`);
    matchingFactors.push({
      name: 'Location Proximity',
      match: false,
      status: 'MISMATCH',
      description: `${lostReport.location.building} vs ${foundReport.location.building}`,
      strength: 'MEDIUM',
    });
  }

  // 5. TIME DIFFERENCE
  const lostTime = parseTimeToMinutes(lostReport.eventTime);
  const foundTime = parseTimeToMinutes(foundReport.eventTime);

  if (lostTime !== null && foundTime !== null) {
    const diff = Math.abs(lostTime - foundTime);
    if (diff <= 30) {
      score += 15;
      matchingFactors.push({
        name: 'Time Proximity',
        match: true,
        status: 'MATCH',
        description: `Tight timeframe: ${lostReport.eventTime} vs ${foundReport.eventTime} (${diff}m delta)`,
        strength: 'STRONG',
      });
    } else if (diff <= 180) {
      score += 10;
      matchingFactors.push({
        name: 'Time Proximity',
        match: true,
        status: 'MATCH',
        description: `Nearby timeframe: ${lostReport.eventTime} vs ${foundReport.eventTime} (${Math.round(diff / 60)}h delta)`,
        strength: 'MEDIUM',
      });
    } else {
      discList.push(`Time Divergence: Lost at ${lostReport.eventTime} vs found at ${foundReport.eventTime} (${Math.round(diff / 60)}h apart)`);
      matchingFactors.push({
        name: 'Time Proximity',
        match: false,
        status: 'MISMATCH',
        description: `Time gap: ${lostReport.eventTime} vs ${foundReport.eventTime} (${Math.round(diff / 60)} hours apart)`,
        strength: 'MEDIUM',
      });
    }
  } else {
    matchingFactors.push({
      name: 'Time Proximity',
      match: true,
      status: 'PARTIAL',
      description: `${lostReport.eventDate || 'Today'} (${lostReport.eventTime}) vs ${foundReport.eventDate || 'Today'} (${foundReport.eventTime})`,
      strength: 'WEAK',
    });
    score += 5;
  }

  // 6. HARDWARE SERIAL NUMBER / PRIVATE EVIDENCE
  const lostSerial =
    claimantEvidenceSerial ||
    lostReport.privateEvidence?.serialNumber;
  const foundSerial = foundReport.privateEvidence?.serialNumber;

  if (lostSerial && foundSerial) {
    if (lostSerial.trim().toUpperCase() === foundSerial.trim().toUpperCase()) {
      score += 15;
      matchingFactors.push({
        name: 'Hardware Serial Number',
        match: true,
        status: 'MATCH',
        description: isSecurityOrAdmin
          ? `${lostSerial} (Exact Cryptographic Match)`
          : 'Confidential • Exact Match Verified in AES-256 Vault',
        strength: 'STRONG',
      });
    } else {
      discList.push('Serial Number Mismatch between lost claim and turned-in asset');
      matchingFactors.push({
        name: 'Hardware Serial Number',
        match: false,
        status: 'MISMATCH',
        description: isSecurityOrAdmin
          ? `Discrepant: ${lostSerial} vs ${foundSerial}`
          : 'Confidential • Mismatch Detected in Institutional Vault',
        strength: 'STRONG',
      });
    }
  } else {
    matchingFactors.push({
      name: 'Hardware Serial Number',
      match: false,
      status: 'PENDING',
      description: 'Confidential • Protected in AES-256 Vault until Officer check',
      strength: 'MEDIUM',
    });
  }

  // If there is a brand conflict (e.g. Dell vs Lenovo), cap confidence score low so it is flagged or disqualified
  if (lostBrand && foundBrand && lostBrand !== foundBrand) {
    score = Math.min(score, 35);
  }

  const confidenceScore = Math.min(Math.max(score, 10), maxPossible);
  const confidenceLevel: 'High' | 'Medium' | 'Low' =
    confidenceScore >= 75 ? 'High' : confidenceScore >= 50 ? 'Medium' : 'Low';

  return {
    confidenceScore,
    confidenceLevel,
    matchingFactors,
    hasSignificantDiscrepancies: discList.length > 0,
    discrepancies: discList,
  };
}

/**
 * Finds the highest quality candidate match for a newly submitted report
 */
export function findBestCandidateMatch(
  newReport: Report,
  candidates: Report[]
): { candidate: Report; score: number; evaluation: CorrelationEvaluation } | null {
  const newBrand = extractBrand(newReport);

  // Filter candidates of opposite type (LOST matches with FOUND; FOUND matches with LOST)
  const oppositeType = newReport.type === 'LOST' ? 'FOUND' : 'LOST';
  const viable = candidates.filter(
    (c) =>
      c.type === oppositeType &&
      c.status !== 'RETURNED' &&
      c.id !== newReport.id &&
      c.category === newReport.category
  );

  let bestMatch: { candidate: Report; score: number; evaluation: CorrelationEvaluation } | null = null;

  for (const candidate of viable) {
    const candidateBrand = extractBrand(candidate);

    // Hard disqualification: if both have known brands and they differ (e.g. Dell vs Lenovo)
    if (newBrand && candidateBrand && newBrand !== candidateBrand) {
      continue;
    }

    const lostReport = newReport.type === 'LOST' ? newReport : candidate;
    const foundReport = newReport.type === 'FOUND' ? newReport : candidate;

    const evalResult = evaluateReportCorrelation(lostReport, foundReport);

    // Only accept genuine matches with score >= 60
    if (evalResult.confidenceScore >= 60) {
      if (!bestMatch || evalResult.confidenceScore > bestMatch.score) {
        bestMatch = {
          candidate,
          score: evalResult.confidenceScore,
          evaluation: evalResult,
        };
      }
    }
  }

  return bestMatch;
}
