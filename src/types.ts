/**
 * Campus Pick — PES College of Engineering, Mandya (PESCE Mandya)
 * Core Data Models & Types
 */

export type UserRole = 'student' | 'faculty' | 'staff' | 'security' | 'admin';

export interface User {
  id: string;
  displayName: string;
  role: UserRole;
  college: string; // "PES College of Engineering, Mandya"
  shortCollege: string; // "PESCE Mandya"
  email: string;
  identifier: string; // USN for student, Employee ID for faculty/staff, Badge for security
  department?: string;
  semester?: string;
  avatarUrl?: string;
  successfullyReturnedItems: number;
  points: number;
  rank: number;
  verified: boolean;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  dept: string;
  returns: number;
  points: number;
  avatar: string;
  isUser?: boolean;
}

export type ReportType = 'LOST' | 'FOUND';
export type ItemComplexity = 'SIMPLE' | 'DETAILED';
export type ReportStatus =
  | 'LOST'
  | 'FOUND'
  | 'POTENTIAL_MATCH'
  | 'VERIFICATION_REQUIRED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'HANDOVER_ARRANGED'
  | 'OWNER_CONFIRMED'
  | 'FINDER_CONFIRMED'
  | 'RETURNED'
  | 'DISMISSED'
  | 'SUSPICIOUS';

export type ItemCategory =
  | 'id_card'
  | 'electronics'
  | 'keys'
  | 'books_notes'
  | 'wallet_bag'
  | 'calculator'
  | 'certificate'
  | 'other';

export interface CampusLocation {
  building: string;
  floor: string;
  room: string;
  areaDescription?: string;
  lat?: number;
  lng?: number;
  precision: 'EXACT' | 'APPROXIMATE' | 'GENERAL' | 'UNKNOWN';
}

export interface PrivateOwnershipEvidence {
  serialNumber?: string;
  invoiceUrl?: string;
  invoiceFileName?: string;
  privateNotes?: string;
  uniqueMarks?: string;
  productReferenceUrl?: string;
  ownerWithItemPhotoUrl?: string;
}

export interface Report {
  id: string;
  ticketNumber: string; // e.g. CP-2026-00142
  type: ReportType;
  complexity: ItemComplexity;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  reporterDepartment?: string;
  reporterAvatarUrl?: string;
  college: string; // "PES College of Engineering, Mandya"
  itemName: string;
  category: ItemCategory;
  brand?: string;
  model?: string;
  color?: string;
  description: string;
  identifyingFeatures?: string;
  publicPhotoUrl?: string;
  imageUrl?: string;
  location: CampusLocation;
  eventDate: string; // e.g. "Today" or "Sept 10, 2026"
  eventTime: string; // e.g. "3:45 PM"
  status: ReportStatus;
  privateEvidence?: PrivateOwnershipEvidence;
  hasPrivateEvidence: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MatchFactor {
  name: string;
  match: boolean;
  status?: 'MATCH' | 'MISMATCH' | 'PARTIAL' | 'PENDING';
  description: string;
  strength: 'STRONG' | 'MEDIUM' | 'WEAK';
}

export interface PotentialMatch {
  id: string;
  lostReportId: string;
  foundReportId: string;
  lostReport: Report;
  foundReport: Report;
  confidenceScore: number; // e.g. 87
  confidenceLevel: 'High' | 'Medium' | 'Low';
  matchingFactors: MatchFactor[];
  status: 'PENDING' | 'DISMISSED' | 'VERIFICATION_INITIATED' | 'VERIFIED' | 'RESOLVED';
  createdAt: string;
  hasSignificantDiscrepancies?: boolean;
  discrepancies?: string[];
}

export type VerificationStatus =
  | 'NOT_STARTED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'NEEDS_MORE_EVIDENCE'
  | 'VERIFIED'
  | 'REJECTED';

export interface VerificationRecord {
  id: string;
  matchId: string;
  claimantId: string;
  claimantName: string;
  status: VerificationStatus;
  submittedEvidence: {
    serialNumberProvided?: string;
    lockscreenOrDecalHint?: string;
    invoiceDocumentUrl?: string;
    additionalNotes?: string;
  };
  reviewedBy?: string; // e.g. "Admin Dr. N. Shivakumar" or "Officer R. Nair"
  approverRole?: 'ADMIN' | 'OFFICER';
  reviewNotes?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  isSystemNotice?: boolean;
}

export interface HandoverSchedule {
  id: string;
  matchId: string;
  lostReportId: string;
  foundReportId: string;
  location: string; // e.g. "Gate 1 Campus Security Exchange Kiosk"
  date: string;
  time: string;
  witnessOfficer: string; // "Officer R. Nair (Badge #CS-409)"
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'DISPUTED';
  ownerConfirmed: boolean;
  ownerConfirmedAt?: string;
  finderConfirmed: boolean;
  finderConfirmedAt?: string;
  officerWitnessed: boolean;
  officerWitnessedAt?: string;
}

export type NotificationType =
  | 'GENERAL_LOST'
  | 'GENERAL_FOUND'
  | 'PRIORITY_ALERT'
  | 'POTENTIAL_MATCH'
  | 'VERIFICATION_REQUIRED'
  | 'VERIFICATION_APPROVED'
  | 'MORE_EVIDENCE_NEEDED'
  | 'HANDOVER_SCHEDULED'
  | 'RETURN_CONFIRMED'
  | 'HERO_RECOGNITION'
  | 'SECURITY_DISPATCH';

export type NotificationCategory =
  | 'all'
  | 'match'
  | 'action'
  | 'handover'
  | 'priority'
  | 'bulletin';

export interface NotificationItem {
  id: string;
  userId?: string; // If undefined or 'ALL', broadcast
  type: NotificationType;
  priority: boolean; // Special Priority Alert
  title: string;
  message: string;
  targetingReason?: string; // "Why you're seeing this: Your verified PESCE enrollment associates you with CS-204..."
  relatedReportId?: string;
  relatedMatchId?: string;
  deepLinkTarget?: string; // 'matches' | 'verification' | 'handover' | 'report' | 'map' | 'heroes'
  timestamp: string;
  read: boolean;
}

export interface FinderContribution {
  id: string;
  finderId: string;
  finderName: string;
  reportId: string;
  itemName: string;
  handoverId: string;
  successfulReturnDate: string;
  pointsAwarded: number;
  status: 'VERIFIED' | 'ADJUSTED' | 'REVOKED';
  officerAttestation: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string; // CP-HERO-2026-000084
  userId: string;
  userName: string;
  userDepartment: string;
  userUsn: string;
  achievement: string; // "Bronze Campus Hero" / "Silver Campus Hero"
  returnCountMilestone: number;
  issueDate: string;
  authorizedBy: string; // "PES College of Engineering, Mandya"
  deanSignature: string; // "Dr. N. Shivakumar (Dean, Student Welfare)"
  securityChiefSignature: string; // "Capt. R. Deshmukh (Campus Security Chief)"
  hash: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  requiredReturns: number;
  requiredPoints: number;
  status: 'LOCKED' | 'ELIGIBLE' | 'PENDING_APPROVAL' | 'APPROVED' | 'READY_FOR_COLLECTION';
  approvalRequired: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  caseId?: string;
}
