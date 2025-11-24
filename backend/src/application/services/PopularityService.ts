// =============== ① モテ度 ===============

import { TypeFlags } from "./common/TypeFlags";
import { toS10 } from "./common/ScoreBuckets";
import {
  Attractiveness,
  AttractivenessScores,
  AttractivenessLevels,
  AttractivenessTexts,
  createAttractiveness,
} from "../../domain/valueObjects/Attractiveness";
import {
  chanceTextsByLevel,
  firstImpressionTextsByLevel,
  lastingTextsByLevel,
} from "./texts/PopularityTexts";
import { calculatePopularityScores } from "../../domain/services/PopularityCalculator";

/**
 * モテ度スコアを計算（ドメインサービスへの委譲）
 * @deprecated この関数は後方互換性のために残されています。直接 calculatePopularityScores を使用してください。
 */
export function calcAttractivenessScores(
  flags: TypeFlags
): AttractivenessScores {
  return calculatePopularityScores(flags);
}

// レベル & テキスト生成
export function buildAttractivenessResult(flags: TypeFlags): Attractiveness {
  const scores = calcAttractivenessScores(flags);

  const levelChance = toS10(scores.chance);
  const levelFirst = toS10(scores.firstImpression);
  const levelLast = toS10(scores.lastingLikeability);

  const textChance = chanceTextsByLevel[levelChance];
  const textFirst = firstImpressionTextsByLevel[levelFirst];
  const textLast = lastingTextsByLevel[levelLast];

  const summary =
    `出会いの多さについては、${textChance} ` +
    `初対面では、${textFirst} ` +
    `そして長く付き合うと、${textLast}`;

  const levels: AttractivenessLevels = {
    chance: levelChance,
    firstImpression: levelFirst,
    lastingLikeability: levelLast,
  };

  const texts: AttractivenessTexts = {
    chance: textChance,
    firstImpression: textFirst,
    lastingLikeability: textLast,
    summary,
  };

  return createAttractiveness(scores, levels, texts);
}
