/**
 * DiagnosisResult Entity
 * 診断結果の集約ルート（Aggregate Root）
 */

import { MBTIType } from "../valueObjects/MBTIType";
import { LoveType } from "../valueObjects/LoveType";
import { Attractiveness } from "../valueObjects/Attractiveness";
import { PersonalityAxis } from "../valueObjects/PersonalityAxis";

/**
 * 診断結果の詳細（5つの診断項目）
 */
export interface DiagnosisResults {
  attractiveness: Attractiveness;
  personalityAxis: PersonalityAxis;
  // 以下は後ほど実装
  // compatibility: Compatibility;
  // loveLanguages: LoveLanguages;
  // lifeAllocation: LifeAllocation;
}

/**
 * 診断結果エンティティ
 * メモリ上のみで存在し、永続化はされない
 */
export interface DiagnosisResult {
  mbti: MBTIType;
  loveType: LoveType;
  results: DiagnosisResults;
}

/**
 * DiagnosisResultを作成
 */
export function createDiagnosisResult(
  mbti: MBTIType,
  loveType: LoveType,
  results: DiagnosisResults
): DiagnosisResult {
  return {
    mbti,
    loveType,
    results,
  };
}

/**
 * DiagnosisResultが有効かバリデーション
 */
export function validateDiagnosisResult(result: DiagnosisResult): void {
  if (!result.mbti || result.mbti.length !== 4) {
    throw new Error(`Invalid MBTI type: ${result.mbti}`);
  }

  if (!result.loveType || result.loveType.length !== 4) {
    throw new Error(`Invalid Love Type: ${result.loveType}`);
  }

  if (!result.results) {
    throw new Error('Diagnosis results cannot be null or undefined');
  }

  if (!result.results.attractiveness) {
    throw new Error('Attractiveness result is required');
  }

  if (!result.results.personalityAxis) {
    throw new Error('PersonalityAxis result is required');
  }
}
