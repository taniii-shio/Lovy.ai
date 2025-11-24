// ドメインサービス: 相性スコア計算（純粋なビジネスロジック）

import { TypeFlags } from "../../application/services/common/TypeFlags";

/**
 * 相性の関係性フレーバー
 */
export type RelationFlavorType = "soulmate" | "partner" | "hybrid" | "magnet";

/**
 * 相性スコア情報
 */
export interface CompatibilityScore {
  score: number;
  relationFlavor: RelationFlavorType;
}

/**
 * 相性スコアを計算する純粋関数
 * テキストやレベルの変換には関与せず、数値計算のみを行う
 *
 * @param selfFlags - 自分の性格特性フラグ
 * @param otherFlags - 相手の性格特性フラグ
 * @returns 計算された相性スコアとフレーバー
 */
export function calculateCompatibilityScore(
  selfFlags: TypeFlags,
  otherFlags: TypeFlags
): CompatibilityScore {
  const s = selfFlags;
  const o = otherFlags;

  // 類似性スコア（同じであればプラス）
  const simSN = s.N === o.N ? 1 : 0;
  const simTF = s.Fm === o.Fm ? 1 : 0;
  const simJP = s.J === o.J ? 1 : 0;
  const simEI = s.E === o.E ? 1 : 0;
  const simRP = s.R === o.R ? 1 : 0;
  const simOE = s.O === o.O ? 1 : 0;

  // 補完性スコア（異なればプラス）
  const compLF = s.L !== o.L ? 1 : 0;
  const compCA = s.C !== o.C ? 1 : 0;

  // 重み付け合計
  const compatRaw =
    0.18 * simSN +
    0.16 * simTF +
    0.18 * simJP +
    0.08 * simEI +
    0.12 * simRP +
    0.08 * simOE +
    0.1 * compLF +
    0.1 * compCA;

  const score = Math.min(100, compatRaw * 100);

  // 関係性フレーバーの判定
  const similarityScore =
    (s.N === o.N ? 1 : 0) +
    (s.Fm === o.Fm ? 1 : 0) +
    (s.J === o.J ? 1 : 0) +
    (s.E === o.E ? 1 : 0) +
    (s.R === o.R ? 1 : 0) +
    (s.O === o.O ? 1 : 0);

  const complementScore = (s.L !== o.L ? 1 : 0) + (s.C !== o.C ? 1 : 0);

  let relationFlavor: RelationFlavorType;
  if (similarityScore >= 4) {
    relationFlavor = "soulmate";
  } else if (complementScore === 2) {
    relationFlavor = "partner";
  } else if (similarityScore >= 2 && complementScore === 1) {
    relationFlavor = "hybrid";
  } else {
    relationFlavor = "magnet";
  }

  return {
    score,
    relationFlavor,
  };
}
