// ドメインサービス: 愛情表現スコア計算（純粋なビジネスロジック）

import { TypeFlags } from "../../application/services/common/TypeFlags";

/**
 * 愛情表現の種類
 */
export type LoveLanguageType = "words" | "time" | "gifts" | "service" | "touch";

/**
 * 愛情表現のスコア情報
 */
export interface LoveLanguageScore {
  key: LoveLanguageType;
  score: number;
  rank: number;
}

/**
 * 愛情表現の全スコア
 */
export interface LoveLanguageScores {
  items: LoveLanguageScore[];
}

/**
 * 愛情表現スコアを計算する純粋関数
 * テキストやレベルの変換には関与せず、数値計算のみを行う
 *
 * @param flags - 性格特性フラグ
 * @returns 計算された愛情表現スコア（ランク順でソート済み）
 */
export function calculateLoveLanguageScores(flags: TypeFlags): LoveLanguageScores {
  const { Fm, N, El, I, Fl, A, J, Tm, R, E, C, Pl } = flags;

  const rawWords = 0.50 * Fm + 0.30 * N + 0.20 * El;
  const rawTime  = 0.45 * I  + 0.25 * Fm + 0.20 * Fl + 0.10 * A;
  const rawGifts = 0.40 * N  + 0.35 * J  + 0.25 * El;
  const rawServ  = 0.40 * J  + 0.35 * Tm + 0.25 * R;
  const rawTouch = 0.55 * E  + 0.25 * C  + 0.20 * Pl;

  const scoreWords = Math.min(100, rawWords * 100);
  const scoreTime  = Math.min(100, rawTime  * 100);
  const scoreGifts = Math.min(100, rawGifts * 100);
  const scoreServ  = Math.min(100, rawServ  * 100);
  const scoreTouch = Math.min(100, rawTouch * 100);

  const items: LoveLanguageScore[] = [
    { key: "words", score: scoreWords, rank: 0 },
    { key: "time", score: scoreTime, rank: 0 },
    { key: "gifts", score: scoreGifts, rank: 0 },
    { key: "service", score: scoreServ, rank: 0 },
    { key: "touch", score: scoreTouch, rank: 0 },
  ];

  // スコア順に並べて rank を付与
  items.sort((a, b) => b.score - a.score);
  items.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  return { items };
}
