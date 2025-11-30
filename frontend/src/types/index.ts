// MBTI Type (from backend)
export type MBTIType =
  | 'ENFJ' | 'ENFP' | 'ENTJ' | 'ENTP'
  | 'ESFJ' | 'ESFP' | 'ESTJ' | 'ESTP'
  | 'INFJ' | 'INFP' | 'INTJ' | 'INTP'
  | 'ISFJ' | 'ISFP' | 'ISTJ' | 'ISTP';

export const MBTI_TYPES: readonly MBTIType[] = [
  'ENFJ', 'ENFP', 'ENTJ', 'ENTP',
  'ESFJ', 'ESFP', 'ESTJ', 'ESTP',
  'INFJ', 'INFP', 'INTJ', 'INTP',
  'ISFJ', 'ISFP', 'ISTJ', 'ISTP',
] as const;

// Love Type (from backend)
export type LoveType =
  | 'LCRO' | 'LCRE' | 'LCPO' | 'LCPE'
  | 'LARO' | 'LARE' | 'LAPO' | 'LAPE'
  | 'FCRO' | 'FCRE' | 'FCPO' | 'FCPE'
  | 'FARO' | 'FARE' | 'FAPO' | 'FAPE';

export const LOVE_TYPES: readonly LoveType[] = [
  'LCRO', 'LCRE', 'LCPO', 'LCPE',
  'LARO', 'LARE', 'LAPO', 'LAPE',
  'FCRO', 'FCRE', 'FCPO', 'FCPE',
  'FARO', 'FARE', 'FAPO', 'FAPE',
] as const;

// User Profile Input (allows empty strings during input)
export interface UserProfileInput {
  nickname: string;
  mbti: MBTIType | '';
  loveType: LoveType | '';
}

// User Profile (validated, no empty strings)
export interface UserProfile {
  nickname: string;
  mbti: MBTIType;
  loveType: LoveType;
}

// Type guard to validate UserProfile
export function isValidUserProfile(input: UserProfileInput): input is UserProfile {
  return (
    input.nickname.trim() !== '' &&
    input.mbti !== '' &&
    input.loveType !== ''
  );
}

// Backend API Response Types
export interface Attractiveness {
  scores: {
    totalScore: number;
    chance: number;
    firstImpression: number;
    lastingLikeability: number;
  };
  levels: {
    chance: string;
    firstImpression: string;
    lastingLikeability: string;
  };
  texts: {
    chance: string;
    firstImpression: string;
    lastingLikeability: string;
    summary: string;
  };
}

export interface PersonalityAxis {
  top3: Array<{
    key: string;
    label: string;
    score: number;
    level: string;
    text: string;
  }>;
  allAxes: Array<{
    key: string;
    label: string;
    score: number;
    level: string;
    text: string;
  }>;
}

export interface Compatibility {
  bestMatches: Array<{
    partner: {
      mbti: string;
      loveType: string;
    };
    score: number;
    level: string;
    relationFlavor: string;
    description: string;
  }>;
  summary: string;
}

export interface LoveLanguage {
  items: Array<{
    key: string;
    label: string;
    score: number;
    rank: number;
    level: string;
    text: string;
  }>;
  summaryText: string;
}

export interface LifeAllocation {
  items: Array<{
    key: string;
    label: string;
    percent: number;
    level: string;
    text: string;
  }>;
  summaryText: string;
}

export interface DiagnosisResults {
  attractiveness: Attractiveness;
  personalityAxis: PersonalityAxis;
  compatibility: Compatibility;
  loveLanguage: LoveLanguage;
  lifeAllocation: LifeAllocation;
}

export interface DiagnosisResult {
  mbti: MBTIType;
  loveType: LoveType;
  results: DiagnosisResults;
}
