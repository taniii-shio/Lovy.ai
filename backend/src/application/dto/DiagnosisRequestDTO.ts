import { MBTIType } from "../../domain/valueObjects/MBTIType";
import { LoveType } from "../../domain/valueObjects/LoveType";

/**
 * 診断リクエストDTO
 */
export interface DiagnosisRequestDTO {
  /** MBTIタイプ (例: "ENFP") */
  mbti: MBTIType;

  /** 恋愛タイプ (例: "LCPO") */
  loveType: LoveType;
}

/**
 * DiagnosisRequestDTOのバリデーション
 */
export function validateDiagnosisRequest(
  data: unknown
): data is DiagnosisRequestDTO {
  if (typeof data !== "object" || data === null) {
    throw new Error("リクエストはオブジェクトである必要があります");
  }

  const req = data as Record<string, unknown>;

  // mbtiのバリデーション
  if (typeof req.mbti !== "string") {
    throw new Error("mbtiは文字列である必要があります");
  }
  if (req.mbti.length !== 4) {
    throw new Error("mbtiは4文字である必要があります");
  }

  // loveTypeのバリデーション
  if (typeof req.loveType !== "string") {
    throw new Error("loveTypeは文字列である必要があります");
  }
  if (req.loveType.length !== 4) {
    throw new Error("loveTypeは4文字である必要があります");
  }

  return true;
}
