// ドメインサービス: 性格ベクトルスコア計算（純粋なビジネスロジック）

import { TypeFlags } from "../../application/services/common/TypeFlags";

/**
 * 性格軸の種類
 */
export type PersonalityAxisKey =
  | "extraversion"
  | "introversionDepth"
  | "intuitionRomance"
  | "realism"
  | "thinking"
  | "feeling"
  | "structure"
  | "flexibility"
  | "cuddleNeed"
  | "acceptWarmth"
  | "leadAttitude";

/**
 * 性格軸のスコア情報
 */
export interface PersonalityAxisScore {
  key: PersonalityAxisKey;
  score: number;
}

/**
 * 性格ベクトルの全スコア
 */
export interface PersonalityScores {
  allAxes: PersonalityAxisScore[];
  top3: PersonalityAxisScore[];
}

/**
 * 性格ベクトルのスコアを計算する純粋関数
 * テキストやレベルの変換には関与せず、数値計算のみを行う
 *
 * @param flags - 性格特性フラグ
 * @returns 計算された性格ベクトルスコア
 */
export function calculatePersonalityScores(flags: TypeFlags): PersonalityScores {
  const { E, I, N, S, Fm, Tm, J, Pm, C, A, R, Pl, L } = flags;

  const axes: PersonalityAxisScore[] = [
    { key: "extraversion", score: E * 100 },
    { key: "introversionDepth", score: I * 100 },
    { key: "intuitionRomance", score: (0.7 * N + 0.3 * Pl) * 100 },
    { key: "realism", score: (0.7 * S + 0.3 * R) * 100 },
    { key: "thinking", score: Tm * 100 },
    { key: "feeling", score: Fm * 100 },
    { key: "structure", score: J * 100 },
    { key: "flexibility", score: Pm * 100 },
    { key: "cuddleNeed", score: C * 100 },
    { key: "acceptWarmth", score: A * 100 },
    { key: "leadAttitude", score: L * 100 },
  ];

  // スコア降順でソートし、上位3つを抽出
  const sorted = [...axes].sort((a, b) => b.score - a.score);
  const top3 = sorted.slice(0, 3);

  return {
    allAxes: axes,
    top3,
  };
}
