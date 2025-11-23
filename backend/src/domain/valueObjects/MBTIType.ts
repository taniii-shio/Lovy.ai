/**
 * MBTI Type Definition
 * 16 personality types based on 4 axes
 */

export type MBTIAxis1 = "E" | "I"; // Extraversion / Introversion
export type MBTIAxis2 = "N" | "S"; // Intuition / Sensing
export type MBTIAxis3 = "T" | "F"; // Thinking / Feeling
export type MBTIAxis4 = "J" | "P"; // Judging / Perceiving

export type MBTIType = `${MBTIAxis1}${MBTIAxis2}${MBTIAxis3}${MBTIAxis4}`;

/**
 * All 16 MBTI Types
 */
export const MBTI_TYPES: readonly MBTIType[] = [
  "ENFJ",
  "ENFP",
  "ENTJ",
  "ENTP",
  "ESFJ",
  "ESFP",
  "ESTJ",
  "ESTP",
  "INFJ",
  "INFP",
  "INTJ",
  "INTP",
  "ISFJ",
  "ISFP",
  "ISTJ",
  "ISTP",
] as const;

/**
 * Validate if a string is a valid MBTI type
 */
export function isValidMBTIType(value: string): value is MBTIType {
  return MBTI_TYPES.includes(value as MBTIType);
}

/**
 * Parse MBTI type from string with validation
 * @throws Error if invalid
 */
export function parseMBTIType(value: string): MBTIType {
  const normalized = value.trim().toUpperCase();

  if (!isValidMBTIType(normalized)) {
    throw new Error(
      `Invalid MBTI type: ${value}. Must be one of ${MBTI_TYPES.join(", ")}`
    );
  }

  return normalized;
}

/**
 * Get individual axes from MBTI type
 */
export function getMBTIAxes(mbti: MBTIType): {
  axis1: MBTIAxis1;
  axis2: MBTIAxis2;
  axis3: MBTIAxis3;
  axis4: MBTIAxis4;
} {
  return {
    axis1: mbti[0] as MBTIAxis1,
    axis2: mbti[1] as MBTIAxis2,
    axis3: mbti[2] as MBTIAxis3,
    axis4: mbti[3] as MBTIAxis4,
  };
}
