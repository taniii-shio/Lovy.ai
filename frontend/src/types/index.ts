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

export const MBTI_LABELS: Record<MBTIType, string> = {
  'ENFJ': '主人公',
  'ENFP': '広報運動家',
  'ENTJ': '指揮官',
  'ENTP': '討論者',
  'ESFJ': '領事官',
  'ESFP': 'エンターテイナー',
  'ESTJ': '幹部',
  'ESTP': '起業家',
  'INFJ': '提唱者',
  'INFP': '仲介者',
  'INTJ': '建築家',
  'INTP': '論理学者',
  'ISFJ': '擁護者',
  'ISFP': '冒険家',
  'ISTJ': '管理者',
  'ISTP': '巨匠',
};

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

export const LOVE_TYPE_LABELS: Record<LoveType, string> = {
  'LCRO': 'ボス猫',
  'LCRE': '隠れベイビー',
  'LCPO': '主役体質',
  'LCPE': 'ツンデレヤンキー',
  'LARO': '憧れの先輩',
  'LARE': 'カリスマバランサー',
  'LAPO': 'パーフェクトカメレオン',
  'LAPE': 'キャプテンライオン',
  'FCRO': 'ロマンスマジシャン',
  'FCRE': 'ちゃっかりうさぎ',
  'FCPO': '恋愛モンスター',
  'FCPE': '忠犬ハチ公',
  'FARO': '不思議生命体',
  'FARE': '敏腕マネージャー',
  'FAPO': 'デビル天使',
  'FAPE': '最後の恋人',
};

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
