// =============== ⑤ 人生の時間配分 (プレゼンテーション層) ===============

import { TypeFlags } from "./common/TypeFlags";
import { levelFromPercent } from "./common/ScoreBuckets";
import {
  LifeAllocation,
  LifeItem,
  LIFE_ALLOCATION_LABELS,
  createLifeAllocation,
} from "../../domain/valueObjects/LifeAllocation";
import { lifeTexts } from "./texts/LifeAllocationTexts";
import { calculateLifeAllocationScores } from "../../domain/services/LifeAllocationCalculator";

/**
 * 人生の時間配分を計算してテキスト付きで返す
 */
export function calcLifeAllocation(flags: TypeFlags): LifeAllocation {
  const scores = calculateLifeAllocationScores(flags);

  // スコアをテキスト付きのアイテムに変換
  const items: LifeItem[] = scores.items.map(allocationScore => {
    const level = levelFromPercent(allocationScore.percent);
    return {
      key: allocationScore.key,
      label: LIFE_ALLOCATION_LABELS[allocationScore.key],
      percent: allocationScore.percent,
      level,
      text: lifeTexts[allocationScore.key][level],
    };
  });

  const top1 = items[0];
  const top2 = items[1];

  // サマリーテキスト生成
  const summary =
    `あなたの人生で一番リソースを割きやすいのは「${top1.label}」。たぶん、人生の喜びの多くはここにある。` +
    `次に大事にしてるのは「${top2.label}」。この2つのバランスが、あなたの生き方そのものかもね。`;

  return createLifeAllocation(items, summary);
}
