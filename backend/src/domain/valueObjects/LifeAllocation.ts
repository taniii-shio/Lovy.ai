/**
 * LifeAllocation Value Object
 * 人生の時間配分を表現する値オブジェクト
 */

/**
 * 人生配分のキー
 */
export const LIFE_ALLOCATION_KEYS = [
  'partner',
  'work',
  'friends',
  'family',
  'hobbies',
] as const;

export type LifeKey = typeof LIFE_ALLOCATION_KEYS[number];

/**
 * 人生配分の1つのアイテム
 */
export interface LifeItem {
  key: LifeKey;
  label: string;
  percent: number;
  level: string;  // S1〜S5
  text: string;
}

/**
 * 人生配分の結果全体
 */
export interface LifeAllocation {
  items: LifeItem[];      // 5つの人生配分（パーセンテージ降順）
  summaryText: string;    // サマリーテキスト
}

/**
 * LifeItemを作成
 */
export function createLifeItem(
  key: LifeKey,
  label: string,
  percent: number,
  level: string,
  text: string
): LifeItem {
  // バリデーション
  if (!LIFE_ALLOCATION_KEYS.includes(key)) {
    throw new Error(`Invalid LifeKey: ${key}`);
  }

  if (!label || label.trim().length === 0) {
    throw new Error('LifeItem label cannot be empty');
  }

  if (percent < 0 || percent > 100) {
    throw new Error(`LifeItem percent must be between 0 and 100, got ${percent}`);
  }

  const validLevels = ['S1', 'S2', 'S3', 'S4', 'S5'];
  if (!validLevels.includes(level)) {
    throw new Error(`LifeItem level must be S1-S5, got ${level}`);
  }

  if (!text || text.trim().length === 0) {
    throw new Error('LifeItem text cannot be empty');
  }

  return {
    key,
    label: label.trim(),
    percent,
    level,
    text: text.trim(),
  };
}

/**
 * LifeAllocationを作成
 */
export function createLifeAllocation(
  items: LifeItem[],
  summaryText: string
): LifeAllocation {
  // バリデーション
  if (!items || items.length !== 5) {
    throw new Error('LifeAllocation items must contain exactly 5 items');
  }

  // 全てのキーが存在することを確認
  const keys = new Set(items.map(item => item.key));
  LIFE_ALLOCATION_KEYS.forEach(key => {
    if (!keys.has(key)) {
      throw new Error(`LifeAllocation items must include all 5 keys, missing: ${key}`);
    }
  });

  // パーセンテージの合計が100%に近いことを確認（誤差±1%を許容）
  const totalPercent = items.reduce((sum, item) => sum + item.percent, 0);
  if (Math.abs(totalPercent - 100) > 1) {
    throw new Error(`LifeAllocation items percent must sum to ~100%, got ${totalPercent}`);
  }

  if (!summaryText || summaryText.trim().length === 0) {
    throw new Error('LifeAllocation summaryText cannot be empty');
  }

  return {
    items,
    summaryText: summaryText.trim(),
  };
}

/**
 * 人生配分のラベルマップ
 */
export const LIFE_ALLOCATION_LABELS: Record<LifeKey, string> = {
  partner: '恋人',
  work: '仕事',
  friends: '友人',
  family: '家族',
  hobbies: '趣味',
} as const;
