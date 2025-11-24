import { MBTIType } from "../../domain/valueObjects/MBTIType";
import { LoveType } from "../../domain/valueObjects/LoveType";
import {
  DiagnosisResult,
  createDiagnosisResult,
  validateDiagnosisResult,
} from "../../domain/entities/DiagnosisResult";
import { getFlags } from "../services/common/TypeFlags";
import { buildAttractivenessResult } from "../services/PopularityService";
import { calcPersonalityVector } from "../services/PersonalityVectorService";
import {
  buildCompatibilityResult,
  calcCompatScore,
} from "../services/CompatibilityService";
import { calcLoveLanguages } from "../services/LoveLanguageService";
import { calcLifeAllocation } from "../services/LifeAllocationService";

/**
 * 診断結果作成UseCase
 */
export class CreateDiagnosisUseCase {
  /**
   * 診断を実行し、結果を返す
   */
  execute(mbti: MBTIType, loveType: LoveType): DiagnosisResult {
    // TypeFlagsを生成
    const flags = getFlags(mbti, loveType);

    // ① モテ度
    const attractiveness = buildAttractivenessResult(flags);

    // ② 性格ベクトル
    const personalityAxis = calcPersonalityVector(flags);

    // ③ 相性（全256通りの組み合わせを計算してベスト3を取得）
    const bestPartners = this.calculateBestPartners(mbti, loveType);
    const compatibility = buildCompatibilityResult(
      mbti,
      loveType,
      bestPartners
    );

    // ④ 愛情表現
    const loveLanguage = calcLoveLanguages(flags);

    // ⑤ 人生の時間配分
    const lifeAllocation = calcLifeAllocation(flags);

    // DiagnosisResultを作成
    const result = createDiagnosisResult(mbti, loveType, {
      attractiveness,
      personalityAxis,
      compatibility,
      loveLanguage,
      lifeAllocation,
    });

    // バリデーション
    validateDiagnosisResult(result);

    return result;
  }

  /**
   * 全組み合わせから相性を計算し、ベスト3を抽出
   */
  private calculateBestPartners(
    selfMbti: MBTIType,
    selfLoveType: LoveType
  ): Array<{ mbti: MBTIType; loveType: LoveType }> {
    const selfFlags = getFlags(selfMbti, selfLoveType);
    const allCombinations = this.generateAllCombinations();

    // 各組み合わせの相性スコアを計算
    const scoredPartners = allCombinations.map((partner) => {
      const partnerFlags = getFlags(partner.mbti, partner.loveType);
      const score = calcCompatScore(selfFlags, partnerFlags);
      return { ...partner, score };
    });

    // スコアでソート（降順）
    scoredPartners.sort((a, b) => b.score - a.score);

    // ベスト3を抽出
    const best = scoredPartners
      .slice(0, 3)
      .map(({ mbti, loveType }) => ({ mbti, loveType }));

    return best;
  }

  /**
   * 全MBTI × LoveTypeの組み合わせを生成
   */
  private generateAllCombinations(): Array<{
    mbti: MBTIType;
    loveType: LoveType;
  }> {
    const mbtiTypes: MBTIType[] = [
      "ENFP",
      "ENFJ",
      "ENTP",
      "ENTJ",
      "ESFP",
      "ESFJ",
      "ESTP",
      "ESTJ",
      "INFP",
      "INFJ",
      "INTP",
      "INTJ",
      "ISFP",
      "ISFJ",
      "ISTP",
      "ISTJ",
    ];

    const loveTypes: LoveType[] = [
      "LCPO",
      "LCPE",
      "LCRO",
      "LCRE",
      "LAPO",
      "LAPE",
      "LARO",
      "LARE",
      "FCPO",
      "FCPE",
      "FCRO",
      "FCRE",
      "FAPO",
      "FAPE",
      "FARO",
      "FARE",
    ];

    const combinations: Array<{ mbti: MBTIType; loveType: LoveType }> = [];

    for (const mbti of mbtiTypes) {
      for (const loveType of loveTypes) {
        combinations.push({ mbti, loveType });
      }
    }

    return combinations;
  }
}
