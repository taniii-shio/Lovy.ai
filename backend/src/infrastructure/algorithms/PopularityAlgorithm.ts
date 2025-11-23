// =============== ① モテ度 (S10段階・カジュアル版) ===============

import { TypeFlags } from "./common/TypeFlags";
import { toS10 } from "./common/ScoreBuckets";
import {
  Attractiveness,
  AttractivenessScores,
  AttractivenessLevels,
  AttractivenessTexts,
  createAttractiveness,
} from "../../domain/valueObjects/Attractiveness";

//【採用テキスト】チャンス量 S1〜S10 (カジュアル全開)
const chanceTextsByLevel: Record<string, string> = {
  S10: "マジで歩くパワースポット。いるだけで人が集まるし、フッ軽だから恋の種まき量がエグい。黙ってても恋が始まる強者。",
  S9: "恋のハンター。面白いイベントや新しい出会いを嗅ぎつける天才。基本どこにでもいるし、いつの間にか輪の中心にいる。",
  S8: "陽キャ代表。誘われたら断らないし、自分から企画するのも好き。だから自然と恋の打席に立つ回数がめちゃ多い。",
  S7: "コミュ力おばけ。初対面でも余裕で話せるし、知り合いの知り合いはもう友達。人脈が恋のチャンスに直結してる。",
  S6: "気分次第の行動派。スイッチ入ると驚くほどアクティブになる。恋のビッグウェーブを自分で作れるタイプ。",
  S5: "バランス型フッ軽。一人の時間も好きだけど、楽しいお誘いがあれば飛んでいく。オンオフの切り替えがうまい。",
  S4: "きっかけ待ちの慎重派。仲良い友達からの誘いや、安心できる場所なら参加する。狭く深くの関係から恋が生まれがち。",
  S3: "省エネ体質。大人数は苦手だけど、趣味とか共通の話題がある場なら楽しめる。恋の射程距離は短め。",
  S2: "超インドア派。家が一番落ち着く。恋が始まるなら、オンラインか、マジで信頼してる友達の紹介だけ。",
  S1: "もはや仙人レベル。自分の世界が完成されすぎてて、新しい人が入る隙間がほぼない。恋は降って湧くのを待つスタイル。",
};

//【採用テキスト】第一印象 S1〜S10 (カジュアル全開)
const firstImpressionTextsByLevel: Record<string, string> = {
  S10: "初対面で沼らせる天才。笑顔と話し方が神すぎて、気づいたら相手はあなたのことを考えてる。もはや罪。",
  S9: "最強の愛嬌モンスター。なんか知らんけどめちゃくちゃ話しかけやすいオーラが出てる。老若男女に好かれる太陽みたいな人。",
  S8: "場の支配者。いるだけでその場が明るくなるムードメーカー。親しみやすさMAXで、秒で心を開かせちゃう。",
  S7: "安心感の塊。落ち着いた雰囲気と優しい相槌で、「この人になら何でも話せる」って思わせるカウンセラータイプ。",
  S6: "ちょうどいい人見知り。最初はちょっと静かだけど、話すと面白いのがすぐバレる。そのギャップがたまらない。",
  S5: "聞き上手なサイレントキラー。自分からガツガツいかないけど、気づいたら相手の懐に入ってる。観察眼が鋭い。",
  S4: "猫みたいな気まぐれさん。興味ないと塩対応だけど、好きな話題になると目がキラキラする。その素直さが逆に刺さる。",
  S3: "スルメタイプ。第一印象は「静かな人」。でも話せば話すほど味が出てくるのを、まだ周りは知らない。",
  S2: "人見知りLv.99。心を開くのに時間がかかるけど、一度心を許した相手にはデレを見せるツンデレの原石。",
  S1: "結界張りがち。話しかけるなオーラがすごいけど、それは自分を守るため。実はガラスのハートの持ち主。",
};

//【採用テキスト】継続好感度 S1〜S10 (カジュアル全開)
const lastingTextsByLevel: Record<string, string> = {
  S10: "もはや沼。一緒にいればいるほど「この人しかいない」って思わせる中毒性がある。安心感と刺激のバランスが神がかってる。",
  S9: "人生のパートナー候補。誠実さと優しさがダダ漏れで、将来を考えさせる安心感がすごい。一緒にいて全く疲れない。",
  S8: "心の栄養剤。落ち込んでる時に会いたくなる人。肯定してくれるし、いつも味方でいてくれる信頼感が半端ない。",
  S7: "飽きない面白さ。次は何をしでかすか分からない魅力があって、ずっと一緒にいても新しい発見がある。マンネリ知らず。",
  S6: "居心地のいいソファ。特別なことはないけど、隣にいるとホッとする。空気みたいな存在だけど、いないとマジで困る。",
  S5: "ちょうどいい距離感の達人。お互いの自由を尊重できるから、長くいてもストレスフリー。自立した関係を築ける。",
  S4: "たまに地雷踏むけど、そこが可愛い。ちょっと気分屋なところもあるけど、根は優しいのがバレてるから許せちゃう。",
  S3: "関係性はジェットコースター。めっちゃ楽しい時と、ちょっとすれ違う時の差が激しい。でもその刺激が好きな人にはたまらない。",
  S2: "一人の時間がないと無理なタイプ。ずっと一緒だと息が詰まっちゃうから、会わない時間がお互いのための冷却期間になる。",
  S1: "熱しやすく冷めやすい風来坊。長期的な安定よりも、その瞬間の「楽しい！」が一番大事。去る者追わず来る者拒まず。",
};

// スコア計算ロジック（重みを微調整し、スコアがばらけやすく）
export function calcAttractivenessScores(flags: TypeFlags): AttractivenessScores {
  const { E, J, L, O, Fm, C, Pl, El, R, I, Pm, N } = flags;

  // チャンス量：外向性(E)、主導性(L)、楽観性(O)に加え、計画性(J)と柔軟性(Pm)のバランスを考慮
  const rawChance =
    0.35 * E +
    0.20 * L +
    0.15 * O +
    0.15 * J +
    0.15 * Pm; // 合計 1.0

  // 第一印象：外向性(E)、共感性(Fm)、甘え(C)に加え、情熱(Pl)と直感(N)の影響力を強化
  const rawFirst =
    0.25 * E +
    0.25 * Fm +
    0.20 * C +
    0.20 * Pl +
    0.10 * N; // 合計 1.0

  // 継続好感度：誠実さ(El)、現実性(R)を重視しつつ、共感性(Fm)と計画性(J)の影響を維持し、内向性(I)の深みも加点
  const rawLasting =
    0.30 * El +
    0.25 * R +
    0.20 * Fm +
    0.15 * J +
    0.10 * I; // 合計 1.0

  const chance = Math.min(100, rawChance * 100); // 念のため100点を超えないように
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
