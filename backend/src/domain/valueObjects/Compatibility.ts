/**
 * Compatibility Value Object
 * 相性（ベストマッチ・ワーストマッチ）を表現する値オブジェクト
 */

import { MBTIType } from "./MBTIType";
import { LoveType } from "./LoveType";

/**
 * 相性の関係性フレーバー（4種類）
 */
export type RelationFlavor = "soulmate" | "partner" | "hybrid" | "magnet";

/**
 * 相性パートナーの基本情報
 */
export interface CompatibilityPartner {
  mbti: MBTIType;
  loveType: LoveType;
}

/**
 * 単一の相性エントリ（1つのパートナータイプとの相性）
 */
export interface CompatibilityMatch {
  partner: CompatibilityPartner;
  score: number; // 0-100
  level: string; // S1〜S10
  relationFlavor: RelationFlavor;
  description: string; // 相性の説明文（40通りのマトリクスから取得）
}

/**
 * Compatibilityの完全な値オブジェクト
 */
export interface Compatibility {
  bestMatches: CompatibilityMatch[];
  summary: string; // 相性の総合説明文
}

/**
 * CompatibilityMatchオブジェクトを作成
 */
export function createCompatibilityMatch(
  partner: CompatibilityPartner,
  score: number,
  level: string,
  relationFlavor: RelationFlavor,
  description: string
): CompatibilityMatch {
  // バリデーション
  validatePartner(partner);
  validateScore(score);
  validateLevel(level);
  validateRelationFlavor(relationFlavor);
  validateDescription(description);

  return {
    partner,
    score,
    level,
    relationFlavor,
    description,
  };
}

/**
 * Compatibilityオブジェクトを作成
 */
export function createCompatibility(
  bestMatches: CompatibilityMatch[],
  summary: string
): Compatibility {
  // バリデーション
  validateBestMatches(bestMatches);
  validateSummary(summary);

  return {
    bestMatches,
    summary,
  };
}

/**
 * パートナー情報のバリデーション
 */
function validatePartner(partner: CompatibilityPartner): void {
  if (!partner.mbti || partner.mbti.length !== 4) {
    throw new Error(
      `Invalid MBTI type in partner: ${partner.mbti}. Must be 4 characters.`
    );
  }

  if (!partner.loveType || partner.loveType.length !== 4) {
    throw new Error(
      `Invalid LoveType in partner: ${partner.loveType}. Must be 4 characters.`
    );
  }
}

/**
 * スコアのバリデーション
 */
function validateScore(score: number): void {
  if (typeof score !== "number" || score < 0 || score > 100) {
    throw new Error(`Invalid score: ${score}. Must be between 0 and 100.`);
  }
}

/**
 * レベルのバリデーション（S1〜S10）
 */
function validateLevel(level: string): void {
  const validLevels = [
    "S1",
    "S2",
    "S3",
    "S4",
    "S5",
    "S6",
    "S7",
    "S8",
    "S9",
    "S10",
  ];
  if (!validLevels.includes(level)) {
    throw new Error(
      `Invalid level: ${level}. Must be one of ${validLevels.join(", ")}.`
    );
  }
}

/**
 * 関係性フレーバーのバリデーション
 */
function validateRelationFlavor(flavor: RelationFlavor): void {
  const validFlavors: RelationFlavor[] = [
    "soulmate",
    "partner",
    "hybrid",
    "magnet",
  ];
  if (!validFlavors.includes(flavor)) {
    throw new Error(
      `Invalid relationFlavor: ${flavor}. Must be one of ${validFlavors.join(", ")}.`
    );
  }
}

/**
 * 説明文のバリデーション
 */
function validateDescription(description: string): void {
  if (!description || description.trim().length === 0) {
    throw new Error("Description cannot be empty");
  }
}

/**
 * サマリのバリデーション
 */
function validateSummary(summary: string): void {
  if (!summary || summary.trim().length === 0) {
    throw new Error("Summary cannot be empty");
  }
}

/**
 * BestMatchesのバリデーション
 */
function validateBestMatches(bestMatches: CompatibilityMatch[]): void {
  if (!bestMatches || !Array.isArray(bestMatches)) {
    throw new Error("Best matches must be an array");
  }

  if (bestMatches.length === 0) {
    throw new Error("Best matches cannot be empty");
  }

  // 各マッチのバリデーション
  bestMatches.forEach((match, index) => {
    try {
      validatePartner(match.partner);
      validateScore(match.score);
      validateLevel(match.level);
      validateRelationFlavor(match.relationFlavor);
      validateDescription(match.description);
    } catch (error) {
      throw new Error(
        `Invalid best match at index ${index}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });
}

/**
 * 関係性フレーバーの日本語ラベルを取得
 */
export function getRelationFlavorLabel(flavor: RelationFlavor): string {
  const labels: Record<RelationFlavor, string> = {
    soulmate: "ソウルメイト型",
    partner: "パートナー型",
    hybrid: "ハイブリッド型",
    magnet: "マグネット型",
  };
  return labels[flavor];
}
