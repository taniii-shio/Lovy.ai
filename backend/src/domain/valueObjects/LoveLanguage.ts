/**
 * LoveLanguage Value Object
 * 愛情表現の5つの言語を表現する値オブジェクト
 */

/**
 * 愛情表現のキー
 */
export const LOVE_LANGUAGE_KEYS = [
  'words',
  'time',
  'gifts',
  'service',
  'touch',
] as const;

export type LoveLanguageKey = typeof LOVE_LANGUAGE_KEYS[number];

/**
 * 愛情表現の1つのアイテム
 */
export interface LoveLanguageItem {
  key: LoveLanguageKey;
  label: string;
  score: number;
  level: string;  // S1〜S5
  rank: number;   // 1〜5
  text: string;
}

/**
 * 愛情表現の結果全体
 */
export interface LoveLanguage {
  items: LoveLanguageItem[];      // 5つの愛情表現（ランク順）
  summaryText: string;            // サマリーテキスト
}

/**
 * LoveLanguageItemを作成
 */
export function createLoveLanguageItem(
  key: LoveLanguageKey,
  label: string,
  score: number,
  level: string,
  rank: number,
  text: string
): LoveLanguageItem {
  // バリデーション
  if (!LOVE_LANGUAGE_KEYS.includes(key)) {
    throw new Error(`Invalid LoveLanguageKey: ${key}`);
  }

  if (!label || label.trim().length === 0) {
    throw new Error('LoveLanguageItem label cannot be empty');
  }

  if (score < 0 || score > 100) {
    throw new Error(`LoveLanguageItem score must be between 0 and 100, got ${score}`);
  }

  const validLevels = ['S1', 'S2', 'S3', 'S4', 'S5'];
  if (!validLevels.includes(level)) {
    throw new Error(`LoveLanguageItem level must be S1-S5, got ${level}`);
  }

  if (rank < 1 || rank > 5) {
    throw new Error(`LoveLanguageItem rank must be between 1 and 5, got ${rank}`);
  }

  if (!text || text.trim().length === 0) {
    throw new Error('LoveLanguageItem text cannot be empty');
  }

  return {
    key,
    label: label.trim(),
    score,
    level,
    rank,
    text: text.trim(),
  };
}

/**
 * LoveLanguageを作成
 */
export function createLoveLanguage(
  items: LoveLanguageItem[],
  summaryText: string
): LoveLanguage {
  // バリデーション
  if (!items || items.length !== 5) {
    throw new Error('LoveLanguage items must contain exactly 5 items');
  }

  // 全てのキーが存在することを確認
  const keys = new Set(items.map(item => item.key));
  LOVE_LANGUAGE_KEYS.forEach(key => {
    if (!keys.has(key)) {
      throw new Error(`LoveLanguage items must include all 5 keys, missing: ${key}`);
    }
  });

  // ランクが1〜5で重複なく設定されていることを確認
  const ranks = items.map(item => item.rank).sort();
  const expectedRanks = [1, 2, 3, 4, 5];
  if (!ranks.every((rank, i) => rank === expectedRanks[i])) {
    throw new Error('LoveLanguage items must have ranks 1-5 without duplicates');
  }

  if (!summaryText || summaryText.trim().length === 0) {
    throw new Error('LoveLanguage summaryText cannot be empty');
  }

  return {
    items,
    summaryText: summaryText.trim(),
  };
}

/**
 * 愛情表現のラベルマップ
 */
export const LOVE_LANGUAGE_LABELS: Record<LoveLanguageKey, string> = {
  words: '言葉',
  time: '一緒に過ごす時間',
  gifts: 'プレゼント',
  service: 'サービス・行動',
  touch: 'スキンシップ',
} as const;
