import { useState, useCallback } from "react";
import type { MBTIType, LoveType, DiagnosisResult } from "../types";
import { diagnosisApi, ApiError } from "../services/api";
import {
  userProfileStorage,
  diagnosisResultStorage,
  type StoredDiagnosisResult,
} from "../utils/storage";

export interface UseDiagnosisReturn {
  isAnalyzing: boolean;
  isComplete: boolean;
  error: string | null;
  runDiagnosis: (params: {
    nickname: string;
    mbti: MBTIType;
    loveType: LoveType;
  }) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for running diagnosis analysis
 *
 * @param minWaitTime - Minimum wait time in milliseconds for UX
 * @returns Diagnosis state and control functions
 */
export function useDiagnosis(minWaitTime = 3000): UseDiagnosisReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnosis = useCallback(
    async (params: { nickname: string; mbti: MBTIType; loveType: LoveType }) => {
      setIsAnalyzing(true);
      setIsComplete(false);
      setError(null);

      try {
        // Save user profile to session storage
        userProfileStorage.save({
          nickname: params.nickname,
          mbti: params.mbti,
          loveType: params.loveType,
        });

        // Start API call and minimum wait time in parallel
        const [result] = await Promise.all([
          diagnosisApi.analyze({
            mbti: params.mbti,
            loveType: params.loveType,
          }),
          new Promise((resolve) => setTimeout(resolve, minWaitTime)),
        ]);

        // Save diagnosis result with nickname
        const resultWithNickname: StoredDiagnosisResult = {
          ...result,
          nickname: params.nickname,
        };
        diagnosisResultStorage.save(resultWithNickname);

        setIsComplete(true);
      } catch (err) {
        console.error("Diagnosis error:", err);

        if (err instanceof ApiError) {
          setError(
            err.status === 408
              ? "リクエストがタイムアウトしました。もう一度お試しください。"
              : `分析に失敗しました: ${err.message}`
          );
        } else if (err instanceof Error) {
          setError(`エラーが発生しました: ${err.message}`);
        } else {
          setError("予期しないエラーが発生しました。");
        }
      } finally {
        setIsAnalyzing(false);
      }
    },
    [minWaitTime]
  );

  const reset = useCallback(() => {
    setIsAnalyzing(false);
    setIsComplete(false);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    isComplete,
    error,
    runDiagnosis,
    reset,
  };
}
