// ドメインサービス - 純粋なビジネスロジック
// このモジュールは、プレゼンテーション層から独立した計算ロジックを提供します

export {
  calculatePopularityScores,
  type PopularityScores,
} from "./PopularityCalculator";

export {
  calculatePersonalityScores,
  type PersonalityScores,
  type PersonalityAxisScore,
  type PersonalityAxisKey,
} from "./PersonalityCalculator";

export {
  calculateLoveLanguageScores,
  type LoveLanguageScores,
  type LoveLanguageScore,
  type LoveLanguageType,
} from "./LoveLanguageCalculator";

export {
  calculateCompatibilityScore,
  type CompatibilityScore,
  type RelationFlavorType,
} from "./CompatibilityCalculator";

export {
  calculateLifeAllocationScores,
  type LifeAllocationScores,
  type LifeAllocationScore,
  type LifeAllocationCategory,
} from "./LifeAllocationCalculator";
