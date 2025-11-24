// =============== ④ 愛情表現 ===============

import { TypeFlags } from "./common/TypeFlags";
import { toS5 } from "./common/ScoreBuckets";
import {
  LoveLanguage,
  LoveLanguageItem,
  LOVE_LANGUAGE_LABELS,
  createLoveLanguage,
} from "../../domain/valueObjects/LoveLanguage";
import { loveTexts } from "./texts/LoveLanguageTexts";
import { calculateLoveLanguageScores } from "../../domain/services/LoveLanguageCalculator";

/**
 * 愛情表現を計算してテキスト付きで返す
 */
export function calcLoveLanguages(flags: TypeFlags): LoveLanguage {
  const scores = calculateLoveLanguageScores(flags);

  // スコアをテキスト付きのアイテムに変換
  const items: LoveLanguageItem[] = scores.items.map((langScore) => {
    const level = toS5(langScore.score);
    return {
      key: langScore.key,
      label: LOVE_LANGUAGE_LABELS[langScore.key],
      score: langScore.score,
      rank: langScore.rank,
      level,
      text: loveTexts[langScore.key][level],
    };
  });

  const top1 = items[0];
  const top2 = items[1];

  // サマリーテキスト生成
  const summary =
    `あなたにとって一番大事なのは「${top1.label}」。これが満たされると、マジで幸せを感じるはず。` +
    `次にグッとくるのは「${top2.label}」。この2つをパートナーにそっと教えてあげると、関係がもっと良くなるかも！`;

  return createLoveLanguage(items, summary);
}
