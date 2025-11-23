// =============== ⑤ 人生の時間配分 (カジュアル版) ===============

import { TypeFlags } from "./common/TypeFlags";
import { levelFromPercent } from "./common/ScoreBuckets";
import {
  LifeAllocation,
  LifeItem,
  LifeKey,
  LIFE_ALLOCATION_LABELS,
  createLifeAllocation,
} from "../../domain/valueObjects/LifeAllocation";

//【採用テキスト】人生の時間配分5種 × S1〜S5 の辞書 (カジュアル全開)
const lifeTexts: Record<LifeKey, Record<string, string>> = {
  partner: { // 恋人
    S5: "人生の9割くらい恋愛でできてる。恋人がいるかいないかで、マジで世界の彩りが変わるタイプ。",
    S4: "恋愛の優先順位、かなり高め。仕事も友達も大事だけど、結局恋人との時間が一番の充電になる。",
    S3: "恋人は大事なパートナー。でも、自分の時間も同じくらい大事。バランス感覚を重視する現実派。",
    S2: "恋愛は人生のスパイス的な感じ。なくても生きていけるけど、あるとちょっと楽しい、くらいの距離感。",
    S1: "恋愛にリソース割くの、もったいなくない？って思ってるフシがある。他にやりたいことが多すぎる。",
  },
  work: { // 仕事
    S5: "ワーカホリックの才能アリ。「仕事が趣味」って言えちゃうくらい、キャリアに人生を捧げてる。",
    S4: "仕事デキる人。目標達成とかスキルアップに快感を覚える。仕事で認められるのが一番嬉しい。",
    S3: "仕事は生活のための手段、と割り切ってる。プライベートを充実させるために、きっちり働くタイプ。",
    S2: "「定時ダッシュ」がモットー。仕事はあくまで仕事。人生の楽しみは、会社を出てから始まる。",
    S1: "「働きたくない」が口癖。できることなら、仕事に割く時間を極限まで減らして生きていきたい。",
  },
  friends: { // 友人
    S5: "友達がいれば何もいらないレベル。一人でいる時間なんてほぼない。常に誰かと繋がっていたい。",
    S4: "フッ軽日本代表。週５で飲み会とか余裕。友達との予定でスケジュール帳が真っ黒になるのが幸せ。",
    S3: "広く浅くより、狭く深く派。親友と呼べる数人と、定期的に会えればそれで満足。",
    S2: "友達は量より質。連絡不精だけど、本当に大事な友達のことはちゃんと覚えてる。",
    S1: "基本ソロ活動。友達付き合いは、正直ちょっと面倒くさいって思ってる。一人が一番ラク。",
  },
  family: { // 家族
    S5: "何があっても家族が一番。人生の決断は、いつも家族が基準。親孝行とかめっちゃしたいタイプ。",
    S4: "家族LOVE。定期的に実家に帰ったり、連絡を取ったりするのが当たり前。家族のイベントは絶対参加。",
    S3: "感謝はしてるけど、ちょっと距離感は欲しい。干渉されすぎるのは苦手。つかず離れずがベスト。",
    S2: "自立心が旺盛。家族のことは好きだけど、自分の人生は自分で決めたい。連絡は用事がある時だけ。",
    S1: "ほぼ絶縁状態（心の中で）。物理的にも精神的にも、家族からできるだけ遠く離れていたい。",
  },
  hobbies: { // 趣味
    S5: "趣味が人生そのもの。趣味のために仕事して、趣味のために生きてる。推し活とかに全財産つぎ込める。",
    S4: "寝食忘れるくらい没頭できる趣味がある。休日は全部趣味の時間。そのために平日頑張ってる。",
    S3: "多趣味なミーハー。広く浅く、色んなことに手を出して楽しむのが好き。飽きっぽいとも言う。",
    S2: "これといった趣味はないけど、暇つぶしは得意。ネトフリ見たり、SNS見たりしてたら一日が終わる。",
    S1: "趣味って何？ってレベル。好きなことはあるけど、それに時間やお金をかけるほどじゃないと思ってる。",
  },
};

// スコア計算ロジック
export function calcLifeAllocation(flags: TypeFlags): LifeAllocation {
  const { Fm, N, C, A, Pl, J, Tm, R, El, E, I, Pm, O } = flags;

  const rawPartner = 0.35 * Fm + 0.25 * N + 0.20 * C + 0.15 * A + 0.05 * Pl;
  const rawWork    = 0.40 * J + 0.30 * Tm + 0.20 * R + 0.10 * El;
  const rawFriends = 0.50 * E + 0.30 * N + 0.20 * O;
  const rawFamily  = 0.35 * Fm + 0.35 * J + 0.30 * El;
  const rawHobbies = 0.35 * I + 0.35 * N + 0.20 * Pm + 0.10 * O;

  const sumRaw = rawPartner + rawWork + rawFriends + rawFamily + rawHobbies;

  const items: LifeItem[] = [
    { key: "partner", label: LIFE_ALLOCATION_LABELS.partner, percent: (rawPartner / sumRaw) * 100, level: "", text: "" },
    { key: "work", label: LIFE_ALLOCATION_LABELS.work, percent: (rawWork / sumRaw) * 100, level: "", text: "" },
    { key: "friends", label: LIFE_ALLOCATION_LABELS.friends, percent: (rawFriends / sumRaw) * 100, level: "", text: "" },
    { key: "family", label: LIFE_ALLOCATION_LABELS.family, percent: (rawFamily / sumRaw) * 100, level: "", text: "" },
    { key: "hobbies", label: LIFE_ALLOCATION_LABELS.hobbies, percent: (rawHobbies / sumRaw) * 100, level: "", text: "" },
  ];

  // レベルとテキストを付与
  items.forEach(item => {
    const level = levelFromPercent(item.percent);
    item.level = level;
    item.text = lifeTexts[item.key][level];
  });

  // パーセンテージ降順でソート
  items.sort((a, b) => b.percent - a.percent);

  const top1 = items[0];
  const top2 = items[1];

  // サマリーテキストもカジュアルに
  const summary =
    `あなたの人生で一番リソースを割きやすいのは「${top1.label}」。たぶん、人生の喜びの多くはここにある。` +
    `次に大事にしてるのは「${top2.label}」。この2つのバランスが、あなたの生き方そのものかもね。`;

  return createLifeAllocation(items, summary);
}
