export type DegreeLevel = 'BACHELOR' | 'MASTER' | 'PHD' | 'RESEARCH' | 'FELLOWSHIP';
export type FundingType = 'FULLY_FUNDED' | 'PARTIALLY_FUNDED' | 'TUITION_ONLY';
export type ApplicationStatus = 'SAVED' | 'PREPARING' | 'SUBMITTED' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED';

export interface Scholarship {
  id: string;
  title: string;
  titleEn: string;
  university: string;
  universityEn: string;
  country: string;
  countryEn: string;
  flagEmoji: string;
  degreeLevel: DegreeLevel;
  fundingType: FundingType;
  majorCategory: string;
  minGpa: number;
  requiresLanguage: boolean;
  minIeltsScore: number;
  minToeflScore: number;
  deadline: string;
  stipendAmount?: string;
  description: string;
  descriptionEn: string;
  benefits: string[];
  requirements: string[];
  eligibleNationalities: string[];
  officialUrl: string;
  isFeatured: boolean;
  viewsCount: number;
  applicationCount: number;
}

export interface StudentProfile {
  uid: string;
  fullName: string;
  email: string;
  nationality: string;
  currentGpa: number;
  gpaScale: number;
  hasLanguageCert: boolean;
  languageTestType: 'IELTS' | 'TOEFL' | 'DUOLINGO' | 'NONE';
  languageScore: number;
  targetDegree: DegreeLevel;
  targetMajor: string;
  academicBio: string;
  savedScholarshipIds: string[];
  applications: {
    scholarshipId: string;
    status: ApplicationStatus;
    appliedAt: string;
    notes?: string;
  }[];
  isAdmin?: boolean;
}

export interface EligibilityResult {
  matchPercentage: number;
  isEligible: boolean;
  criteriaScores: {
    degreeMatch: { points: number; max: number; status: 'MATCH' | 'MISMATCH'; note: string };
    gpaScore: { points: number; max: number; status: 'MET' | 'CLOSE' | 'DEFICIT'; note: string };
    languageScore: { points: number; max: number; status: 'MET' | 'WAIVED' | 'DEFICIT'; note: string };
    nationalityMatch: { points: number; max: number; status: 'ELIGIBLE' | 'RESTRICTED'; note: string };
  };
  strengthPoints: string[];
  missingCriteria: string[];
  recommendation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'advisor';
  text: string;
  timestamp: string;
}

export interface PlatformStats {
  totalScholarships: number;
  fullyFundedCount: number;
  partnerUniversities: number;
  supportedCountries: number;
  registeredStudents: number;
  awardedStudents: number;
}