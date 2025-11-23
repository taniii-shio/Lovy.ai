// ===============================
// ③ 相性 (フレーバー拡張・カジュアル版)
// ===============================

import { TypeFlags, getFlags } from "./common/TypeFlags";
import { toS10 } from "./common/ScoreBuckets";
import {
  Compatibility,
  CompatibilityMatch,
  CompatibilityPartner,
  BestWorstMatches,
  RelationFlavor,
  createCompatibility,
  createCompatibilityMatch,
} from "../../domain/valueObjects/Compatibility";
import { MBTIType } from "../../domain/valueObjects/MBTIType";
import { LoveType } from "../../domain/valueObjects/LoveType";

// ===============================
// 相性解説文マトリクス (40通り)
// ===============================

const compatTexts: Record<RelationFlavor, Record<string, string>> = {
  soulmate: {
    S10: "前世からの双子？ってくらい魂が共鳴する相性。言葉なんていらないレベルで、隣にいるだけで満たされる奇跡の関係。",
    S9: "「それな！」が無限に続く最強の相棒。価値観の根っこが同じだから、何をしててもストレスフリー。もはや家族。",
    S8: "考えることがほぼ一緒。同じタイミングで笑って、同じことでムカつく。一緒にいてこれ以上ラクな人はいないかも。",
    S7: "居心地のいいカフェみたいな関係。多くを語らなくても、お互いの空気感がフィットするから、自然体でいられる。",
    S6: "基本的には分かり合える仲。たまに細かい部分で「ん？」ってなっても、「まあ、わかるよ」で済ませられる。",
    S5: "似てる部分が多いから安心できるけど、たまに違いが際立つ関係。お互いのマイペースを尊重するのが大事。",
    S4: "似てると思って油断してると、意外な地雷を踏むかも。同じようで、実は譲れないポイントが微妙に違う。",
    S3: "似てるからこそ、相手の嫌な部分が自分を見てるみたいでイラッとしちゃうことがある。鏡だと思って受け入れてみて。",
    S2: "同族嫌悪に陥りがちな危険な組み合わせ。「自分と同じ欠点」が目について、許せなくなりやすい。",
    S1: "似すぎてて全く進展しない二人。お互い考えてることが分かるからこそ、逆に何も行動を起こせない。",
  },
  partner: {
    S10: "性格は真逆なのに、パズルのピースがハマるみたいに最強の化学反応が起きる。二人でいればマジで無敵。",
    S9: "自分にないものを全部持ってて、尊敬しかない相手。一緒にいるだけで自分の世界が2倍にも3倍にも広がる。",
    S8: "最強のビジネスパートナー。お互いの得意なことが全く違うから、役割分担が神レベルでうまくいく。",
    S7: "違うからこそ面白い！って心から思える関係。相手の考え方が新鮮で、学びしかない。マンネリとは無縁。",
    S6: "最初は「宇宙人？」って思うけど、だんだんその違いがクセになる。理解しようとすることが、もう楽しい。",
    S5: "お互いの違いをリスペクトできれば、良い関係になれる。でも、自分の常識を押し付けた瞬間に終わる。",
    S4: "会話が噛み合わないことが多発。「なんでそうなるの？」の連続で、ちょっと疲れちゃうかも。",
    S3: "補い合うどころか、お互いの弱点をえぐり合う危険な関係。良かれと思ったことが、だいたい裏目に出る。",
    S2: "根本的に生きる世界が違う二人。一緒にいると、お互いのエネルギーを吸い取られて消耗しちゃうかも。",
    S1: "水と油。混ざり合うことがほぼない。惹かれる要素があったとしても、それは一瞬の気の迷いレベル。",
  },
  hybrid: {
    S10: "親友であり、最高の恋人。似てるところで深く共感し、違うところで新鮮な刺激をもらえる、マジで理想的な関係。",
    S9: "飽きることのない最高のパートナー。安心感の土台の上で、思いっきり冒険できる。一緒にいるだけで人生が豊かになる。",
    S8: "安定と変化のいいとこ取り。関係はマンネリしないけど、ちゃんと落ち着ける場所でもある。居心地の良さがヤバい。",
    S7: "ちょうどいい距離感の達人。お互いの世界を尊重しつつ、交わる時は深く楽しめる。自立した大人の関係。",
    S6: "基本は仲良し、たまにすれ違い。大きなズレはないけど、細かい価値観の違いを話し合うことが大事。",
    S5: "友達としては最高だけど、恋人だとどうだろ？って感じの関係。一線を越えるには、もう一歩の理解が必要。",
    S4: "心地よさとストレスが交互に来る。相手の好きな部分と、どうしても理解できない部分がハッキリ分かれてる。",
    S3: "どっちつかずで不安定になりがち。似てるようで違う、違うようで似てる…って考えてる間に疲れちゃう。",
    S2: "お互いの良いところを打ち消し合っちゃうかも。似てる部分が悪い方向に、違う部分も悪い方向に作用しやすい。",
    S1: "噛み合うポイントが一つもない。どこを取っても中途半端にズレてて、関係を続けるのがかなり難しい。",
  },
  magnet: {
    S10: "他はどうでもいい。一つの共通点だけで、すべてを超越するレベルで惹かれ合う。「運命」って信じちゃう相性。",
    S9: "普段は絶対交わらない二人が、あるテーマ（趣味、仕事など）について語りだすと、朝まで止まらない。そこが沼。",
    S8: "普段は水と油なのに、スイッチが入ると最強のバディになる。二人じゃないと出せない化学反応がある。",
    S7: "一点の強烈な魅力で、他の欠点が全部どうでもよくなる。危ういけど、抗えない魅力がある関係。",
    S6: "共通の目標や趣味があるうちは最高に楽しい。でも、それがなくなると「あれ、何話せばいいんだっけ？」ってなる。",
    S5: "ピンポイントで惹かれるけど、それ以外の部分での価値観の違いがデカい。関係を続けるには割り切りが必要。",
    S4: "強烈な魅力は一瞬で、長い目で見るとストレスの方が大きいかも。瞬間的な楽しみに全振りした関係。",
    S3: "一点の魅力に惹かれて近づくと、他の部分のズレで火傷する。近づきすぎ注意な関係。",
    S2: "共通点がニッチすぎて、そこ以外で全く共感できない。その一点だけで繋がるには、エネルギーが要りすぎる。",
    S1: "惹かれ合う磁力（N極とS極）が弱すぎる。そもそも出会っても、お互いを異物として認識して終わる可能性が高い。",
  },
};

// ===============================
// 相性スコア計算（オフラインでの事前計算用）
// ===============================

export function calcCompatScore(selfFlags: TypeFlags, otherFlags: TypeFlags): number {
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

  return Math.min(100, compatRaw * 100);
}

// ===============================
// 関係性の味（フレーバー）判定ロジック
// ===============================

export function calcRelationFlavor(
  selfFlags: TypeFlags,
  otherFlags: TypeFlags
): RelationFlavor {
  const s = selfFlags;
  const o = otherFlags;

  // 類似性スコア（6項目）
  const similarityScore =
    (s.N === o.N ? 1 : 0) +
    (s.Fm === o.Fm ? 1 : 0) +
    (s.J === o.J ? 1 : 0) +
    (s.E === o.E ? 1 : 0) +
    (s.R === o.R ? 1 : 0) +
    (s.O === o.O ? 1 : 0);

  // 補完性スコア（2項目）
  const complementScore = (s.L !== o.L ? 1 : 0) + (s.C !== o.C ? 1 : 0);

  // フレーバー判定
  if (similarityScore >= 4) {
    return "soulmate";
  }
  if (complementScore === 2) {
    return "partner";
  }
  if (similarityScore >= 2 && complementScore === 1) {
    return "hybrid";
  }
  return "magnet"; // 上記以外は一点突破型とする
}

// ===============================
// 解説文を動的に生成（内部ヘルパー）
// ===============================

function getCompatibilityDescription(
  flavor: RelationFlavor,
  level: string
): string {
  // マトリクスから、フレーバーとレベルに合った文章を直接取得する
  if (compatTexts[flavor] && compatTexts[flavor][level]) {
    return compatTexts[flavor][level];
  }
  return "この組み合わせには、まだ誰も知らない特別な化学反応が眠っているようです。";
}

// ===============================
// 解説文を動的に生成する（オンラインでの表示用、エクスポート版）
// ===============================

export function buildCompatibilityDescription(entry: CompatibilityMatch): string {
  // マトリクスから、フレーバーとレベルに合った文章を直接取得する
  const flavor = entry.relationFlavor;
  const level = entry.level;

  // 念のため、キーが存在しない場合のフォールバック
  if (compatTexts[flavor] && compatTexts[flavor][level]) {
    return compatTexts[flavor][level];
  }
  return "この組み合わせには、まだ誰も知らない特別な化学反応が眠っているようです。";
}

// ===============================
// 相性マッチ作成（VOを使用）
// ===============================

export function buildCompatibilityMatch(
  selfMbti: MBTIType,
  selfLoveType: LoveType,
  partnerMbti: MBTIType,
  partnerLoveType: LoveType
): CompatibilityMatch {
  const selfFlags = getFlags(selfMbti, selfLoveType);
  const otherFlags = getFlags(partnerMbti, partnerLoveType);

  const score = calcCompatScore(selfFlags, otherFlags);
  const level = toS10(score);
  const relationFlavor = calcRelationFlavor(selfFlags, otherFlags);
  const description = getCompatibilityDescription(relationFlavor, level);

  const partner: CompatibilityPartner = {
    mbti: partnerMbti,
    loveType: partnerLoveType,
  };

  return createCompatibilityMatch(partner, score, level, relationFlavor, description);
}

// ===============================
// 相性結果全体を作成（VOを使用）
// ===============================

export function buildCompatibilityResult(
  selfMbti: MBTIType,
  selfLoveType: LoveType,
  bestPartners: Array<{ mbti: MBTIType; loveType: LoveType }>,
  worstPartners: Array<{ mbti: MBTIType; loveType: LoveType }>
): Compatibility {
  // ベストマッチを作成
  const best = bestPartners.map((p) =>
    buildCompatibilityMatch(selfMbti, selfLoveType, p.mbti, p.loveType)
  );

  // ワーストマッチを作成
  const worst = worstPartners.map((p) =>
    buildCompatibilityMatch(selfMbti, selfLoveType, p.mbti, p.loveType)
  );

  const matches: BestWorstMatches = { best, worst };

  // サマリー生成
  const summary = generateCompatibilitySummary(best, worst);

  return createCompatibility(matches, summary);
}

// ===============================
// サマリー生成
// ===============================

function generateCompatibilitySummary(
  best: CompatibilityMatch[],
  _worst: CompatibilityMatch[]
): string {
  const bestFlavors = best.map((m) => m.relationFlavor);

  const flavorCount = {
    soulmate: 0,
    partner: 0,
    hybrid: 0,
    magnet: 0,
  };

  bestFlavors.forEach((f) => flavorCount[f]++);

  let dominantFlavor: RelationFlavor = "hybrid";
  let maxCount = 0;
  (Object.keys(flavorCount) as RelationFlavor[]).forEach((f) => {
    if (flavorCount[f] > maxCount) {
      maxCount = flavorCount[f];
      dominantFlavor = f;
    }
  });

  const flavorSummaries: Record<RelationFlavor, string> = {
    soulmate:
      "あなたは価値観が似ている人と深く共鳴する相性タイプ。同じ波長の人と一緒にいると、言葉なしでも通じ合える安心感があります。",
    partner:
      "あなたは自分にないものを持っている人と補い合う相性タイプ。真逆の性格でも、お互いを高め合える関係を築けます。",
    hybrid:
      "あなたは似ている部分と異なる部分のバランスが取れた人と相性が良いタイプ。安定感と新鮮さの両方を楽しめます。",
    magnet:
      "あなたは特定の共通点で強く惹かれ合う相性タイプ。一点突破の魅力で、普段は交わらない人とも深い絆を築けます。",
  };

  return flavorSummaries[dominantFlavor];
}
