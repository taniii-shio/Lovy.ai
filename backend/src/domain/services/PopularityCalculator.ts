// ドメインサービス: モテ度スコア計算（純粋なビジネスロジック）

import { TypeFlags } from "../../application/services/common/TypeFlags";

/**
 * モテ度の各スコアを表す型
 */
export interface PopularityScores {
  totalScore: number;
  chance: number;
  firstImpression: number;
  lastingLikeability: number;
}

/**
 * モテ度スコアを計算する純粋関数
 * テキストやレベルの変換には関与せず、数値計算のみを行う
 *
 * @param flags - 性格特性フラグ
 * @returns 計算されたモテ度スコア
 */
export function calculatePopularityScores(flags: TypeFlags): PopularityScores {
  const { E, J, L, O, Fm, C, Pl, El, R, I, Pm, N } = flags;

  // チャンス量：外向性(E)、主導性(L)、楽観性(O)に加え、計画性(J)と柔軟性(Pm)のバランスを考慮
  const rawChance =
    0.35 * E +
    0.20 * L +
    0.15 * O +
    0.15 * J +
    0.15 * Pm;

  // 第一印象：外向性(E)、共感性(Fm)、甘え(C)に加え、情熱(Pl)と直感(N)の影響力を強化
  const rawFirst =
    0.25 * E +
    0.25 * Fm +
    0.20 * C +
    0.20 * Pl +
    0.10 * N;

  // 継続好感度：誠実さ(El)、現実性(R)を重視しつつ、共感性(Fm)と計画性(J)の影響を維持し、内向性(I)の深みも加点
  const rawLasting =
    0.30 * El +
    0.25 * R +
    0.20 * Fm +
    0.15 * J +
    0.10 * I;

  const chance = Math.min(100, rawChance * 100);
  const firstImpression = Math.min(100, rawFirst * 100);
  const lastingLikeability = Math.min(100, rawLasting * 100);

  // 3つのスコアの平均値を計算
  const totalScore = (chance + firstImpression + lastingLikeability) / 3;

  return {
    totalScore,
    chance,
    firstImpression,
    lastingLikeability,
  };
}
