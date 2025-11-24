import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  validateDiagnosisRequest,
  DiagnosisRequestDTO,
} from "../../application/dto/DiagnosisRequestDTO";
import { toDiagnosisResponseDTO } from "../../application/dto/DiagnosisResponseDTO";
import { CreateDiagnosisUseCase } from "../../application/usecases/CreateDiagnosisUseCase";

/**
 * 診断APIハンドラー
 *
 * リクエスト:
 *   POST /diagnosis
 *   Body: { "mbti": "ENFP", "loveType": "LCPO" }
 *
 * レスポンス:
 *   200: DiagnosisResult
 *   400: バリデーションエラー
 *   500: サーバーエラー
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Credentials": allowedOrigin !== "*" ? "true" : "false",
  };

  try {
    // リクエストボディの解析
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "リクエストボディが必要です",
        }),
      };
    }

    let requestData: unknown;
    try {
      requestData = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "無効なJSONフォーマットです",
        }),
      };
    }

    // バリデーション
    try {
      validateDiagnosisRequest(requestData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "バリデーションエラー";
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: message,
        }),
      };
    }

    const request = requestData as DiagnosisRequestDTO;

    // UseCase実行
    const useCase = new CreateDiagnosisUseCase();
    const diagnosisResult = useCase.execute(request.mbti, request.loveType);

    // レスポンス作成
    const response = toDiagnosisResponseDTO(diagnosisResult);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("診断処理中にエラーが発生しました:", error);

    const errorMessage =
      error instanceof Error ? error.message : "内部サーバーエラー";

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "診断処理中にエラーが発生しました",
        details: errorMessage,
      }),
    };
  }
};
