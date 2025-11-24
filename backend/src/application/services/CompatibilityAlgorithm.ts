// ===============================
// ③ 相性 (プレゼンテーション層)
// ===============================

import { TypeFlags, getFlags } from "./common/TypeFlags";
import { toS10 } from "./common/ScoreBuckets";
import {
  Compatibility,
  CompatibilityMatch,
  CompatibilityPartner,
  RelationFlavor,
  createCompatibility,
  createCompatibilityMatch,
} from "../../domain/valueObjects/Compatibility";
import { MBTIType } from "../../domain/valueObjects/MBTIType";
import { LoveType } from "../../domain/valueObjects/LoveType";
import { compatTexts, flavorSummaries } from "./texts/CompatibilityTexts";
import { calculateCompatibilityScore } from "../../domain/services/CompatibilityCalculator";

/**
 * 相性スコアを計算（ドメインサービスへの委譲）
 * @deprecated この関数は後方互換性のために残されています。直接 calculateCompatibilityScore を使用してください。
 */
export function calcCompatScore(selfFlags: TypeFlags, otherFlags: TypeFlags): number {
  return calculateCompatibilityScore(selfFlags, otherFlags).score;
}

/**
 * 関係性フレーバーを計算（ドメインサービスへの委譲）
 * @deprecated この関数は後方互換性のために残されています。直接 calculateCompatibilityScore を使用してください。
 */
export function calcRelationFlavor(
  selfFlags: TypeFlags,
  otherFlags: TypeFlags
): RelationFlavor {
  return calculateCompatibilityScore(selfFlags, otherFlags).relationFlavor;
}

// ===============================
// 解説文を動的に生成（内部ヘルパー）
// ===============================

function getCompatibilityDescription(
  flavor: RelationFlavor,
  level: string
): string {
  // マトリクスから、フレーバーとレベルに合った文章を直接取得する
  if (compatTexts[flavor] && compatTexts[flavor][level]) {
    return compatTexts[flavor][level];
  }
  return "この組み合わせには、まだ誰も知らない特別な化学反応が眠っているようです。";
}

// ===============================
// 解説文を動的に生成する（オンラインでの表示用、エクスポート版）
// ===============================

export function buildCompatibilityDescription(entry: CompatibilityMatch): string {
  // マトリクスから、フレーバーとレベルに合った文章を直接取得する
  const flavor = entry.relationFlavor;
  const level = entry.level;

  // 念のため、キーが存在しない場合のフォールバック
  if (compatTexts[flavor] && compatTexts[flavor][level]) {
    return compatTexts[flavor][level];
  }
  return "この組み合わせには、まだ誰も知らない特別な化学反応が眠っているようです。";
}

// ===============================
// 相性マッチ作成（VOを使用）
// ===============================

export function buildCompatibilityMatch(
  selfMbti: MBTIType,
  selfLoveType: LoveType,
  partnerMbti: MBTIType,
  partnerLoveType: LoveType
): CompatibilityMatch {
  const selfFlags = getFlags(selfMbti, selfLoveType);
  const otherFlags = getFlags(partnerMbti, partnerLoveType);

  const score = calcCompatScore(selfFlags, otherFlags);
  const level = toS10(score);
  const relationFlavor = calcRelationFlavor(selfFlags, otherFlags);
  const description = getCompatibilityDescription(relationFlavor, level);

  const partner: CompatibilityPartner = {
    mbti: partnerMbti,
    loveType: partnerLoveType,
  };

  return createCompatibilityMatch(partner, score, level, relationFlavor, description);
}

// ===============================
// 相性結果全体を作成（VOを使用）
// ===============================

export function buildCompatibilityResult(
  selfMbti: MBTIType,
  selfLoveType: LoveType,
  bestPartners: Array<{ mbti: MBTIType; loveType: LoveType }>
): Compatibility {
  // ベストマッチを作成
  const bestMatches = bestPartners.map((p) =>
    buildCompatibilityMatch(selfMbti, selfLoveType, p.mbti, p.loveType)
  );

  // サマリー生成
  const summary = generateCompatibilitySummary(bestMatches);

  return createCompatibility(bestMatches, summary);
}

// ===============================
// サマリー生成
// ===============================

function generateCompatibilitySummary(
  bestMatches: CompatibilityMatch[]
): string {
  const bestFlavors = bestMatches.map((m) => m.relationFlavor);

  const flavorCount = {
    soulmate: 0,
    partner: 0,
    hybrid: 0,
    magnet: 0,
  };

  bestFlavors.forEach((f) => flavorCount[f]++);

  let dominantFlavor: RelationFlavor = "hybrid";
  let maxCount = 0;
  (Object.keys(flavorCount) as RelationFlavor[]).forEach((f) => {
    if (flavorCount[f] > maxCount) {
      maxCount = flavorCount[f];
      dominantFlavor = f;
    }
  });

  return flavorSummaries[dominantFlavor];
}
