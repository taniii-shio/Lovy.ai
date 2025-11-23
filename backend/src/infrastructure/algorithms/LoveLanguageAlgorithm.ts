// =============== ④ 愛情表現 (カジュアル版) ===============

import { TypeFlags } from "./common/TypeFlags";
import { toS5 } from "./common/ScoreBuckets";
import {
  LoveLanguage,
  LoveLanguageItem,
  LoveLanguageKey,
  LOVE_LANGUAGE_LABELS,
  createLoveLanguage,
} from "../../domain/valueObjects/LoveLanguage";

//【採用テキスト】愛情表現5種 × S1〜S5 の辞書 (カジュアル全開)
const loveTexts: Record<LoveLanguageKey, Record<string, string>> = {
  words: { // 言葉
    S5: "言葉がマジで大事。「好き」「ありがとう」「すごいね」を毎日言ってほしいタイプ。これが愛情のガソリンになる。",
    S4: "ちゃんと言葉にしてくれないと不安になる。「言わなくてもわかるでしょ」は通用しない。ストレートな言葉が一番響く。",
    S3: "たまにでいいから、ちゃんと言葉で伝えてほしい。普段は態度でOKだけど、肝心な時は言葉が欲しい。",
    S2: "言葉より行動派。「好き」って100回言われるより、1回助けてくれる方がグッとくる。",
    S1: "「口だけなら何とでも言える」って思ってる。言葉での愛情表現は、ほぼ信じてないレベル。",
  },
  time: { // 一緒に過ごす時間
    S5: "「時間＝愛」の人。スマホいじりながらとかじゃなく、ガチで自分と向き合ってくれる時間が何よりのプレゼント。",
    S4: "会ってる時間の「質」をめっちゃ重視する。ただ一緒にいるだけじゃダメで、濃密な時間を過ごしたい。",
    S3: "会う頻度と一人の時間のバランスが大事。どっちかが多すぎるとダメ。ちょうどいい距離感でいたい。",
    S2: "ベッタリは苦手。それぞれの時間を楽しんで、会う時はサクッと楽しむくらいが最高の関係。",
    S1: "会う頻度はマジで気にしない。半年に1回でも、心が繋がってればそれでOK。超自立型。",
  },
  gifts: { // プレゼント
    S5: "プレゼント選びのセンスに愛を感じる。高価なものじゃなくて「私のこと考えてくれたんだな」が伝わるモノが最強。",
    S4: "記念日や誕生日のプレゼントは超重要。そこで愛情を測ってるフシがある。サプライズとか大好き。",
    S3: "ふとした時の、なんでもない日のプレゼントが一番嬉しい。コンビニスイーツとかでもOK。",
    S2: "モノより思い出派。プレゼントも嬉しいけど、それより一緒にどこか行ったり、何かしたりする方が価値を感じる。",
    S1: "プレゼントとかマジでいらない。物が増えるのがストレス なミニマリスト。気持ちだけで十分。",
  },
  service: { // サービス・行動
    S5: "「行動こそが真実」がモットー。落ち込んでる時に何も言わずにそばにいてくれるとか、そういうのが一番刺さる。",
    S4: "「やっとくよ」の一言にキュン死する。さりげなく自分の負担を軽くしてくれる行動に、デカい愛を感じる。",
    S3: "やってもらったら嬉しいけど、自分から求めることはない。あくまで相手の自発的な行動が嬉しい。",
    S2: "「自分のことは自分でやるから大丈夫」って思ってる。過度な手伝いは、逆に申し訳なくなっちゃう。",
    S1: "お世話されるの、むしろ苦手。対等な関係が好きで、どっちかが一方的に支える構図は望んでない。",
  },
  touch: { // スキンシップ
    S5: "触れてる時が一番生きてる実感ある。言葉なくても、手をつないだりハグするだけで全部伝わるって信じてる。",
    S4: "スキンシップは愛情のバロメーター。触れ合いが多いと安心するし、少ないと「なんかあった？」って不安になる。",
    S3: "人前ではベタベタしたくないけど、二人きりの時は甘えたい。TPOをわきまえるタイプ。",
    S2: "スキンシップは気まぐれ。したい時もあれば、今はやめてほしい時もある。気分が乗らないとスルーしちゃう。",
    S1: "あんまりベタベタされるの好きじゃない。心の距離が近ければ、物理的な距離は遠くても平気。",
  },
};

// スコア計算ロジック
export function calcLoveLanguages(flags: TypeFlags): LoveLanguage {
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

  const items: LoveLanguageItem[] = [
    { key: "words", label: LOVE_LANGUAGE_LABELS.words, score: scoreWords, rank: 0, level: "", text: "" },
    { key: "time", label: LOVE_LANGUAGE_LABELS.time, score: scoreTime, rank: 0, level: "", text: "" },
    { key: "gifts", label: LOVE_LANGUAGE_LABELS.gifts, score: scoreGifts, rank: 0, level: "", text: "" },
    { key: "service", label: LOVE_LANGUAGE_LABELS.service, score: scoreServ, rank: 0, level: "", text: "" },
    { key: "touch", label: LOVE_LANGUAGE_LABELS.touch, score: scoreTouch, rank: 0, level: "", text: "" },
  ];

  // スコア順に並べて rank とテキストを付与
  items.sort((a, b) => b.score - a.score);
  items.forEach((item, idx) => {
    item.rank = idx + 1;
    const level = toS5(item.score);
    item.level = level;
    item.text = loveTexts[item.key][level];
  });

  const top1 = items[0];
  const top2 = items[1];

  // サマリーテキストもカジュアルに
  const summary =
    `あなたにとって一番大事なのは「${top1.label}」。これが満たされると、マジで幸せを感じるはず。` +
    `次にグッとくるのは「${top2.label}」。この2つをパートナーにそっと教えてあげると、関係がもっと良くなるかも！`;

  return createLoveLanguage(items, summary);
}
