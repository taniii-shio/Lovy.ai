// =============== ② 性格ベクトル ===============

import { TypeFlags } from "./common/TypeFlags";
import { toS5 } from "./common/ScoreBuckets";
import {
  PersonalityAxis,
  PersonalityVectorItem,
  createPersonalityAxis,
} from "../../domain/valueObjects/PersonalityAxis";
import { personalityTexts } from "./texts/PersonalityTexts";
import { calculatePersonalityScores } from "../../domain/services/PersonalityCalculator";

// 軸のキーとラベルのマッピング
const AXIS_LABELS: Record<string, string> = {
  extraversion: "外向性",
  introversionDepth: "内面志向",
  intuitionRomance: "直観／ロマン性",
  realism: "現実／実務性",
  thinking: "論理性",
  feeling: "共感性",
  structure: "構造化・計画性",
  flexibility: "柔軟・フットワーク",
  cuddleNeed: "甘えニーズ",
  acceptWarmth: "甘え受容力",
  leadAttitude: "主導性",
};

/**
 * 性格ベクトルを計算してテキスト付きで返す（Top3 抽出版）
 */
export function calcPersonalityVector(flags: TypeFlags): PersonalityAxis {
  const scores = calculatePersonalityScores(flags);

  // スコアをテキスト付きのアイテムに変換
  const axes: PersonalityVectorItem[] = scores.allAxes.map((axisScore) => {
    const level = toS5(axisScore.score);
    return {
      key: axisScore.key,
      label: AXIS_LABELS[axisScore.key],
      score: axisScore.score,
      level,
      text: personalityTexts[axisScore.key][level],
    };
  });

  const top3: PersonalityVectorItem[] = scores.top3.map((axisScore) => {
    const level = toS5(axisScore.score);
    return {
      key: axisScore.key,
      label: AXIS_LABELS[axisScore.key],
      score: axisScore.score,
      level,
      text: personalityTexts[axisScore.key][level],
    };
  });

  return createPersonalityAxis(top3, axes);
}
