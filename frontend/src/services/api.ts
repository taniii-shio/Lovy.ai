import type { MBTIType, LoveType, DiagnosisResult } from "../types";

/**
 * API Configuration
 */
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 30000, // 30 seconds
} as const;

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Diagnosis Request Parameters
 */
export interface DiagnosisRequest {
  mbti: MBTIType;
  loveType: LoveType;
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request timeout", 408);
    }
    throw error;
  }
}

/**
 * Diagnosis API Service
 */
export const diagnosisApi = {
  /**
   * Run diagnosis analysis
   */
  async analyze(params: DiagnosisRequest): Promise<DiagnosisResult> {
    try {
      const response = await fetchWithTimeout(
        API_CONFIG.baseUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        },
        API_CONFIG.timeout
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
          `API request failed: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      const result: DiagnosisResult = await response.json();
      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError("Unknown error occurred");
    }
  },
};

/**
 * API Health Check (optional, for future use)
 */
export const healthApi = {
  async check(): Promise<boolean> {
    try {
      const response = await fetchWithTimeout(
        `${API_CONFIG.baseUrl}/health`,
        { method: "GET" },
        5000
      );
      return response.ok;
    } catch {
      return false;
    }
  },
};
