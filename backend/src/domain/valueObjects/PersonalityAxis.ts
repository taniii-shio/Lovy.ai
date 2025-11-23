/**
 * PersonalityAxis Value Object
 * 性格ベクトル（11軸の性格特性）を表現する値オブジェクト
 */

/**
 * 性格ベクトルの1つの軸
 */
export interface PersonalityVectorItem {
  key: string;    // 軸のキー（例: "extraversion"）
  label: string;  // 軸のラベル（例: "外向性"）
  score: number;  // スコア 0〜100
  level: string;  // レベル S1〜S5
  text: string;   // 説明文
}

/**
 * 性格ベクトル全体
 */
export interface PersonalityAxis {
  top3: PersonalityVectorItem[];   // 表示用ベスト3（スコア降順）
  allAxes: PersonalityVectorItem[]; // 全11軸（内部利用 or 拡張用）
}

/**
 * PersonalityVectorItemを作成
 */
export function createPersonalityVectorItem(
  key: string,
  label: string,
  score: number,
  level: string,
  text: string
): PersonalityVectorItem {
  // バリデーション
  if (!key || key.trim().length === 0) {
    throw new Error('PersonalityVectorItem key cannot be empty');
  }

  if (!label || label.trim().length === 0) {
    throw new Error('PersonalityVectorItem label cannot be empty');
  }

  if (score < 0 || score > 100) {
    throw new Error(`PersonalityVectorItem score must be between 0 and 100, got ${score}`);
  }

  const validLevels = ['S1', 'S2', 'S3', 'S4', 'S5'];
  if (!validLevels.includes(level)) {
    throw new Error(`PersonalityVectorItem level must be S1-S5, got ${level}`);
  }

  if (!text || text.trim().length === 0) {
    throw new Error('PersonalityVectorItem text cannot be empty');
  }

  return {
    key: key.trim(),
    label: label.trim(),
    score,
    level,
    text: text.trim(),
  };
}

/**
 * PersonalityAxisを作成
 */
export function createPersonalityAxis(
  top3: PersonalityVectorItem[],
  allAxes: PersonalityVectorItem[]
): PersonalityAxis {
  // バリデーション
  if (!top3 || top3.length !== 3) {
    throw new Error('PersonalityAxis top3 must contain exactly 3 items');
  }

  if (!allAxes || allAxes.length === 0) {
    throw new Error('PersonalityAxis allAxes cannot be empty');
  }

  // Top3がスコア降順であることを確認
  for (let i = 0; i < top3.length - 1; i++) {
    if (top3[i].score < top3[i + 1].score) {
      throw new Error('PersonalityAxis top3 must be sorted by score in descending order');
    }
  }

  return {
    top3,
    allAxes,
  };
}

/**
 * 11軸のキーの定義
 */
export const PERSONALITY_AXIS_KEYS = [
  'extraversion',
  'introversionDepth',
  'intuitionRomance',
  'realism',
  'thinking',
  'feeling',
  'structure',
  'flexibility',
  'cuddleNeed',
  'acceptWarmth',
  'leadAttitude',
] as const;

export type PersonalityAxisKey = typeof PERSONALITY_AXIS_KEYS[number];
