// ===============================
// スコアのバケツ分け（S1〜S5, S1〜S10）
// ===============================

// 0〜100 を S1〜S5 へ
export function toS5(score: number): string {
  if (score >= 80) return "S5";
  if (score >= 60) return "S4";
  if (score >= 40) return "S3";
  if (score >= 20) return "S2";
  return "S1";
}

// 0〜100 を S1〜S10 へ（③相性用）
export function toS10(score: number): string {
  if (score >= 90) return "S10";
  if (score >= 80) return "S9";
  if (score >= 70) return "S8";
  if (score >= 60) return "S7";
  if (score >= 50) return "S6";
  if (score >= 40) return "S5";
  if (score >= 30) return "S4";
  if (score >= 20) return "S3";
  if (score >= 10) return "S2";
  return "S1";
}

// 人生配分％ → S1〜S5
export function levelFromPercent(p: number): string {
  if (p >= 50) return "S5";
  if (p >= 35) return "S4";
  if (p >= 20) return "S3";
  if (p >= 10) return "S2";
  return "S1";
}
