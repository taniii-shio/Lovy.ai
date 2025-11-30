import type { UserProfileInput, MBTIType, LoveType } from "../types";
import { MBTI_TYPES, LOVE_TYPES } from "../types";

export interface ValidationError {
  field: "nickname" | "mbti" | "loveType";
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate user profile input
 */
export function validateUserProfile(input: UserProfileInput): ValidationResult {
  const errors: ValidationError[] = [];

  // Nickname validation
  if (!input.nickname || input.nickname.trim() === "") {
    errors.push({
      field: "nickname",
      message: "ニックネームを入力してください。",
    });
  } else if (input.nickname.trim().length > 10) {
    errors.push({
      field: "nickname",
      message: "ニックネームは10文字以内で入力してください。",
    });
  } else if (input.nickname.trim().length < 1) {
    errors.push({
      field: "nickname",
      message: "ニックネームは1文字以上で入力してください。",
    });
  }

  // MBTI validation
  if (!input.mbti) {
    errors.push({
      field: "mbti",
      message: "16タイプ性格診断を選択してください。",
    });
  } else if (!MBTI_TYPES.includes(input.mbti as MBTIType)) {
    errors.push({
      field: "mbti",
      message: "正しい性格診断タイプを選択してください。",
    });
  }

  // Love Type validation
  if (!input.loveType) {
    errors.push({
      field: "loveType",
      message: "ラブタイプ診断を選択してください。",
    });
  } else if (!LOVE_TYPES.includes(input.loveType as LoveType)) {
    errors.push({
      field: "loveType",
      message: "正しいラブタイプを選択してください。",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get error message for a specific field
 */
export function getFieldError(
  errors: ValidationError[],
  field: "nickname" | "mbti" | "loveType"
): string | undefined {
  return errors.find((error) => error.field === field)?.message;
}
