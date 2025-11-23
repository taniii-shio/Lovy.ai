/**
 * Attractiveness Value Object
 * モテ度スコアと詳細テキストを表現する値オブジェクト
 */

/**
 * モテ度の3つのサブスコア
 */
export interface AttractivenessScores {
  totalScore: number;        // 総合スコア（3つの平均値） 0-100
  chance: number;            // 出会いのチャンス量 0-100
  firstImpression: number;   // 第一印象 0-100
  lastingLikeability: number; // 継続好感度 0-100
}

/**
 * 各サブスコアのレベル（S1〜S10）
 */
export interface AttractivenessLevels {
  chance: string;            // S1〜S10
  firstImpression: string;   // S1〜S10
  lastingLikeability: string; // S1〜S10
}

/**
 * 各サブスコアの説明テキスト
 */
export interface AttractivenessTexts {
  chance: string;            // 出会いのチャンス量の説明
  firstImpression: string;   // 第一印象の説明
  lastingLikeability: string; // 継続好感度の説明
  summary: string;           // 統合サマリテキスト
}

/**
 * Attractivenessの完全な値オブジェクト
 */
export interface Attractiveness {
  scores: AttractivenessScores;
  levels: AttractivenessLevels;
  texts: AttractivenessTexts;
}

/**
 * Attractivenessオブジェクトを作成
 */
export function createAttractiveness(
  scores: AttractivenessScores,
  levels: AttractivenessLevels,
  texts: AttractivenessTexts
): Attractiveness {
  // バリデーション
  validateScores(scores);
  validateLevels(levels);
  validateTexts(texts);

  return {
    scores,
    levels,
    texts,
  };
}

/**
 * スコアのバリデーション
 */
function validateScores(scores: AttractivenessScores): void {
  const { totalScore, chance, firstImpression, lastingLikeability } = scores;

  if (!isValidScore(totalScore)) {
    throw new Error(`Invalid totalScore: ${totalScore}. Must be between 0 and 100.`);
  }
  if (!isValidScore(chance)) {
    throw new Error(`Invalid chance score: ${chance}. Must be between 0 and 100.`);
  }
  if (!isValidScore(firstImpression)) {
    throw new Error(`Invalid firstImpression score: ${firstImpression}. Must be between 0 and 100.`);
  }
  if (!isValidScore(lastingLikeability)) {
    throw new Error(`Invalid lastingLikeability score: ${lastingLikeability}. Must be between 0 and 100.`);
  }
}

/**
 * レベルのバリデーション
 */
function validateLevels(levels: AttractivenessLevels): void {
  const validLevels = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10'];

  if (!validLevels.includes(levels.chance)) {
    throw new Error(`Invalid chance level: ${levels.chance}. Must be S1-S10.`);
  }
  if (!validLevels.includes(levels.firstImpression)) {
    throw new Error(`Invalid firstImpression level: ${levels.firstImpression}. Must be S1-S10.`);
  }
  if (!validLevels.includes(levels.lastingLikeability)) {
    throw new Error(`Invalid lastingLikeability level: ${levels.lastingLikeability}. Must be S1-S10.`);
  }
}

/**
 * テキストのバリデーション
 */
function validateTexts(texts: AttractivenessTexts): void {
  if (!texts.chance || texts.chance.trim().length === 0) {
    throw new Error('chance text cannot be empty');
  }
  if (!texts.firstImpression || texts.firstImpression.trim().length === 0) {
    throw new Error('firstImpression text cannot be empty');
  }
  if (!texts.lastingLikeability || texts.lastingLikeability.trim().length === 0) {
    throw new Error('lastingLikeability text cannot be empty');
  }
  if (!texts.summary || texts.summary.trim().length === 0) {
    throw new Error('summary text cannot be empty');
  }
}

/**
 * スコアが有効な範囲（0-100）かチェック
 */
function isValidScore(score: number): boolean {
  return typeof score === 'number' && score >= 0 && score <= 100;
}

/**
 * スコアレベルの取得（0-100 → S1-S5）
 */
export function getScoreLevel(score: number): string {
  if (score >= 80) return 'S5';
  if (score >= 60) return 'S4';
  if (score >= 40) return 'S3';
  if (score >= 20) return 'S2';
  return 'S1';
}
