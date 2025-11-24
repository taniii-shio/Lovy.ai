#!/usr/bin/env ts-node
/**
 * DiagnosisResult テストスクリプト
 *
 * 使い方:
 *   ts-node scripts/test-diagnosis.ts <MBTI> <LoveType>
 *
 * 例:
 *   ts-node scripts/test-diagnosis.ts ENFP LCPO
 */

import { MBTIType } from "../src/domain/valueObjects/MBTIType";
import { LoveType } from "../src/domain/valueObjects/LoveType";
import {
  DiagnosisResult,
  createDiagnosisResult,
  validateDiagnosisResult,
} from "../src/domain/entities/DiagnosisResult";
import { getFlags } from "../src/application/services/common/TypeFlags";
import { buildAttractivenessResult } from "../src/application/services/PopularityService";
import { calcPersonalityVector } from "../src/application/services/PersonalityVectorService";
import {
  buildCompatibilityResult,
  calcCompatScore,
} from "../src/application/services/CompatibilityService";
import { calcLoveLanguages } from "../src/application/services/LoveLanguageService";
import { calcLifeAllocation } from "../src/application/services/LifeAllocationService";

/**
 * コマンドライン引数を解析
 */
function parseArgs(): { mbti: MBTIType; loveType: LoveType } {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error(
      "❌ エラー: MBTIとLoveTypeの両方を引数として指定してください"
    );
    console.error("");
    console.error("使い方:");
    console.error("  ts-node scripts/test-diagnosis.ts <MBTI> <LoveType>");
    console.error("");
    console.error("例:");
    console.error("  ts-node scripts/test-diagnosis.ts ENFP LCPO");
    console.error("  ts-node scripts/test-diagnosis.ts INTJ FARE");
    console.error("");
    console.error("MBTI: 4文字 (例: ENFP, INTJ, ESFJ)");
    console.error("  - 1文字目: E (外向) / I (内向)");
    console.error("  - 2文字目: S (現実) / N (直感)");
    console.error("  - 3文字目: T (思考) / F (感情)");
    console.error("  - 4文字目: J (計画) / P (柔軟)");
    console.error("");
    console.error("LoveType: 4文字 (例: LCPO, FARE)");
    console.error("  - 1文字目: L (主導) / F (受容)");
    console.error("  - 2文字目: C (甘え) / A (包容)");
    console.error("  - 3文字目: R (現実) / P (情熱)");
    console.error("  - 4文字目: O (楽観) / E (誠実)");
    process.exit(1);
  }

  const mbti = args[0].toUpperCase() as MBTIType;
  const loveType = args[1].toUpperCase() as LoveType;

  // 簡易バリデーション
  if (mbti.length !== 4) {
    console.error(`❌ エラー: MBTIは4文字である必要があります (入力: ${mbti})`);
    process.exit(1);
  }

  if (loveType.length !== 4) {
    console.error(
      `❌ エラー: LoveTypeは4文字である必要があります (入力: ${loveType})`
    );
    process.exit(1);
  }

  return { mbti, loveType };
}

/**
 * 全MBTI × LoveTypeの組み合わせを生成
 */
function generateAllCombinations(): Array<{
  mbti: MBTIType;
  loveType: LoveType;
}> {
  const mbtiTypes: MBTIType[] = [
    "ENFP",
    "ENFJ",
    "ENTP",
    "ENTJ",
    "ESFP",
    "ESFJ",
    "ESTP",
    "ESTJ",
    "INFP",
    "INFJ",
    "INTP",
    "INTJ",
    "ISFP",
    "ISFJ",
    "ISTP",
    "ISTJ",
  ];

  const loveTypes: LoveType[] = [
    "LCPO",
    "LCPE",
    "LCRO",
    "LCRE",
    "LAPO",
    "LAPE",
    "LARO",
    "LARE",
    "FCPO",
    "FCPE",
    "FCRO",
    "FCRE",
    "FAPO",
    "FAPE",
    "FARO",
    "FARE",
  ];

  const combinations: Array<{ mbti: MBTIType; loveType: LoveType }> = [];

  for (const mbti of mbtiTypes) {
    for (const loveType of loveTypes) {
      combinations.push({ mbti, loveType });
    }
  }

  return combinations;
}

/**
 * 全組み合わせから相性を計算し、ベスト3を抽出
 */
function calculateBestPartners(
  selfMbti: MBTIType,
  selfLoveType: LoveType
): Array<{ mbti: MBTIType; loveType: LoveType }> {
  const selfFlags = getFlags(selfMbti, selfLoveType);
  const allCombinations = generateAllCombinations();

  // 各組み合わせの相性スコアを計算
  const scoredPartners = allCombinations.map((partner) => {
    const partnerFlags = getFlags(partner.mbti, partner.loveType);
    const score = calcCompatScore(selfFlags, partnerFlags);
    return { ...partner, score };
  });

  // スコアでソート（降順）
  scoredPartners.sort((a, b) => b.score - a.score);

  // ベスト3を抽出
  const best = scoredPartners
    .slice(0, 3)
    .map(({ mbti, loveType }) => ({ mbti, loveType }));

  return best;
}

/**
 * DiagnosisResultを作成
 */
function createTestDiagnosisResult(
  mbti: MBTIType,
  loveType: LoveType
): DiagnosisResult {
  console.log("\n🔄 TypeFlagsを生成中...");
  const flags = getFlags(mbti, loveType);
  console.log("✅ TypeFlags生成完了");

  console.log("\n🔄 各診断アルゴリズムを実行中...");

  // ① モテ度
  console.log("  ① モテ度を計算中...");
  const attractiveness = buildAttractivenessResult(flags);
  console.log("  ✅ モテ度計算完了");

  // ② 性格ベクトル
  console.log("  ② 性格ベクトルを計算中...");
  const personalityAxis = calcPersonalityVector(flags);
  console.log("  ✅ 性格ベクトル計算完了");

  // ③ 相性（全256通りの組み合わせを計算）
  console.log("  ③ 相性を計算中（全256通りの組み合わせ）...");
  const bestPartners = calculateBestPartners(mbti, loveType);
  const compatibility = buildCompatibilityResult(mbti, loveType, bestPartners);
  console.log("  ✅ 相性計算完了");

  // ④ 愛情表現
  console.log("  ④ 愛情表現を計算中...");
  const loveLanguage = calcLoveLanguages(flags);
  console.log("  ✅ 愛情表現計算完了");

  // ⑤ 人生の時間配分
  console.log("  ⑤ 人生の時間配分を計算中...");
  const lifeAllocation = calcLifeAllocation(flags);
  console.log("  ✅ 人生の時間配分計算完了");

  console.log("\n🔄 DiagnosisResultを作成中...");
  const result = createDiagnosisResult(mbti, loveType, {
    attractiveness,
    personalityAxis,
    compatibility,
    loveLanguage,
    lifeAllocation,
  });
  console.log("✅ DiagnosisResult作成完了");

  return result;
}

/**
 * DiagnosisResultを整形して出力
 */
function printDiagnosisResult(result: DiagnosisResult): void {
  console.log("\n" + "=".repeat(80));
  console.log("📊 診断結果 (DiagnosisResult)");
  console.log("=".repeat(80));

  console.log(`\n🧬 MBTI: ${result.mbti}`);
  console.log(`💕 LoveType: ${result.loveType}`);

  // ① モテ度
  console.log("\n" + "-".repeat(80));
  console.log("① モテ度 (Attractiveness)");
  console.log("-".repeat(80));
  const attr = result.results.attractiveness;
  console.log(`総合スコア: ${attr.scores.totalScore.toFixed(1)}`);
  console.log(
    `  - チャンス量: ${attr.scores.chance.toFixed(1)} (${attr.levels.chance})`
  );
  console.log(
    `  - 第一印象: ${attr.scores.firstImpression.toFixed(1)} (${
      attr.levels.firstImpression
    })`
  );
  console.log(
    `  - 継続好感度: ${attr.scores.lastingLikeability.toFixed(1)} (${
      attr.levels.lastingLikeability
    })`
  );
  console.log(`\n📝 サマリー:`);
  console.log(`${attr.texts.summary}`);

  // ② 性格ベクトル
  console.log("\n" + "-".repeat(80));
  console.log("② 性格ベクトル (PersonalityAxis) - Top 3");
  console.log("-".repeat(80));
  result.results.personalityAxis.top3.forEach((item, idx) => {
    console.log(`\n${idx + 1}. ${item.label} (${item.level})`);
    console.log(`   スコア: ${item.score.toFixed(1)}`);
    console.log(`   ${item.text}`);
  });

  // ③ 相性
  console.log("\n" + "-".repeat(80));
  console.log("③ 相性 (Compatibility)");
  console.log("-".repeat(80));
  console.log(`\n📝 サマリー:`);
  console.log(`${result.results.compatibility.summary}`);
  console.log(`\n✨ ベストマッチ Top 3:`);
  result.results.compatibility.bestMatches.forEach((match, idx) => {
    console.log(
      `\n${idx + 1}. ${match.partner.mbti} × ${match.partner.loveType}`
    );
    console.log(`   スコア: ${match.score.toFixed(1)} (${match.level})`);
    console.log(`   関係性: ${match.relationFlavor}`);
    console.log(`   ${match.description}`);
  });

  // ④ 愛情表現
  console.log("\n" + "-".repeat(80));
  console.log("④ 愛情表現 (LoveLanguage)");
  console.log("-".repeat(80));
  console.log(`\n📝 サマリー:`);
  console.log(`${result.results.loveLanguage.summaryText}`);
  console.log(`\n💖 詳細 (ランキング順):`);
  result.results.loveLanguage.items.forEach((item) => {
    console.log(`\n${item.rank}. ${item.label} (${item.level})`);
    console.log(`   スコア: ${item.score.toFixed(1)}`);
    console.log(`   ${item.text}`);
  });

  // ⑤ 人生の時間配分
  console.log("\n" + "-".repeat(80));
  console.log("⑤ 人生の時間配分 (LifeAllocation)");
  console.log("-".repeat(80));
  console.log(`\n📝 サマリー:`);
  console.log(`${result.results.lifeAllocation.summaryText}`);
  console.log(`\n⏰ 詳細 (配分順):`);
  result.results.lifeAllocation.items.forEach((item, idx) => {
    console.log(`\n${idx + 1}. ${item.label} (${item.level})`);
    console.log(`   配分: ${item.percent.toFixed(1)}%`);
    console.log(`   ${item.text}`);
  });

  console.log("\n" + "=".repeat(80));
}

/**
 * メイン処理
 */
function main() {
  console.log("=".repeat(80));
  console.log("🧪 DiagnosisResult テストスクリプト");
  console.log("=".repeat(80));

  const { mbti, loveType } = parseArgs();

  console.log(`\n📥 入力:`);
  console.log(`  MBTI: ${mbti}`);
  console.log(`  LoveType: ${loveType}`);

  try {
    // DiagnosisResultを作成
    const result = createTestDiagnosisResult(mbti, loveType);

    // バリデーション
    console.log("\n🔍 DiagnosisResultをバリデーション中...");
    validateDiagnosisResult(result);
    console.log("✅ バリデーション成功");

    // 結果を出力
    printDiagnosisResult(result);

    console.log("\n✅ テスト完了！DiagnosisResultは正常に作成されました。");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ エラーが発生しました:");
    if (error instanceof Error) {
      console.error(`  ${error.message}`);
      if (error.stack) {
        console.error("\nスタックトレース:");
        console.error(error.stack);
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// スクリプト実行
main();
