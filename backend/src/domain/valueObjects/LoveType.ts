/**
 * Love Type 16 Definition
 * 16 love personality types based on 4 axes
 */

export type LoveAxis1 = "L" | "F";
export type LoveAxis2 = "C" | "A";
export type LoveAxis3 = "R" | "P";
export type LoveAxis4 = "O" | "E";

export type LoveType = `${LoveAxis1}${LoveAxis2}${LoveAxis3}${LoveAxis4}`;

/**
 * All 16 Love Types
 */
export const LOVE_TYPES: readonly LoveType[] = [
  "LCRO",
  "LCRE",
  "LCPO",
  "LCPE",
  "LARO",
  "LARE",
  "LAPO",
  "LAPE",
  "FCRO",
  "FCRE",
  "FCPO",
  "FCPE",
  "FARO",
  "FARE",
  "FAPO",
  "FAPE",
] as const;

/**
 * Validate if a string is a valid Love Type
 */
export function isValidLoveType(value: string): value is LoveType {
  return LOVE_TYPES.includes(value as LoveType);
}

/**
 * Parse Love Type from string with validation
 * @throws Error if invalid
 */
export function parseLoveType(value: string): LoveType {
  const normalized = value.trim().toUpperCase();

  if (!isValidLoveType(normalized)) {
    throw new Error(
      `Invalid Love Type: ${value}. Must be one of ${LOVE_TYPES.join(", ")}`
    );
  }

  return normalized;
}

/**
 * Get individual axes from Love Type
 */
export function getLoveTypeAxes(loveType: LoveType): {
  axis1: LoveAxis1;
  axis2: LoveAxis2;
  axis3: LoveAxis3;
  axis4: LoveAxis4;
} {
  return {
    axis1: loveType[0] as LoveAxis1,
    axis2: loveType[1] as LoveAxis2,
    axis3: loveType[2] as LoveAxis3,
    axis4: loveType[3] as LoveAxis4,
  };
}

/**
 * Get axis meanings for documentation
 */
export const LOVE_TYPE_AXIS_MEANINGS = {
  axis1: {
    L: "Logical - 論理的・分析的なアプローチ",
    F: "Feeling - 感情的・直感的なアプローチ",
  },
  axis2: {
    C: "Cautious - 慎重・計画的",
    A: "Adventurous - 冒険的・自発的",
  },
  axis3: {
    R: "Rational - 理性的・現実的",
    P: "Passionate - 情熱的・ロマンチック",
  },
  axis4: {
    O: "Open - オープン・社交的",
    E: "Exclusive - 排他的・専一的",
  },
} as const;
