// ドメインサービス: 人生の時間配分スコア計算（純粋なビジネスロジック）

import { TypeFlags } from "../../application/services/common/TypeFlags";

/**
 * 人生の時間配分カテゴリー
 */
export type LifeAllocationCategory = "partner" | "work" | "friends" | "family" | "hobbies";

/**
 * 人生の時間配分スコア情報
 */
export interface LifeAllocationScore {
  key: LifeAllocationCategory;
  percent: number;
}

/**
 * 人生の時間配分の全スコア
 */
export interface LifeAllocationScores {
  items: LifeAllocationScore[];
}

/**
 * 人生の時間配分スコアを計算する純粋関数
 * テキストやレベルの変換には関与せず、数値計算のみを行う
 *
 * @param flags - 性格特性フラグ
 * @returns 計算された時間配分スコア（パーセント降順でソート済み）
 */
export function calculateLifeAllocationScores(flags: TypeFlags): LifeAllocationScores {
  const { Fm, N, C, A, Pl, J, Tm, R, El, E, I, Pm, O } = flags;

  const rawPartner = 0.35 * Fm + 0.25 * N + 0.20 * C + 0.15 * A + 0.05 * Pl;
  const rawWork    = 0.40 * J + 0.30 * Tm + 0.20 * R + 0.10 * El;
  const rawFriends = 0.50 * E + 0.30 * N + 0.20 * O;
  const rawFamily  = 0.35 * Fm + 0.35 * J + 0.30 * El;
  const rawHobbies = 0.35 * I + 0.35 * N + 0.20 * Pm + 0.10 * O;

  const sumRaw = rawPartner + rawWork + rawFriends + rawFamily + rawHobbies;

  const items: LifeAllocationScore[] = [
    { key: "partner", percent: (rawPartner / sumRaw) * 100 },
    { key: "work", percent: (rawWork / sumRaw) * 100 },
    { key: "friends", percent: (rawFriends / sumRaw) * 100 },
    { key: "family", percent: (rawFamily / sumRaw) * 100 },
    { key: "hobbies", percent: (rawHobbies / sumRaw) * 100 },
  ];

  // パーセンテージ降順でソート
  items.sort((a, b) => b.percent - a.percent);

  return { items };
}
