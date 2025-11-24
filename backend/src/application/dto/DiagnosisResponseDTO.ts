import { DiagnosisResult } from "../../domain/entities/DiagnosisResult";

/**
 * 診断レスポンスDTO
 * DiagnosisResultをそのままJSONとして返却する
 */
export type DiagnosisResponseDTO = DiagnosisResult;

/**
 * DiagnosisResultをDTOに変換
 */
export function toDiagnosisResponseDTO(
  result: DiagnosisResult
): DiagnosisResponseDTO {
  // そのまま返却（必要に応じて変換ロジックを追加）
  return result;
}
