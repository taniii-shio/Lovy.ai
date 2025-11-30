import type { DiagnosisResult, MBTIType, LoveType } from "../types";

// Session Storage Keys
export const STORAGE_KEYS = {
  USER_PROFILE: "userProfile",
  DIAGNOSIS_RESULT: "diagnosisResult",
} as const;

// User Profile Storage Type
export interface StoredUserProfile {
  nickname: string;
  mbti: MBTIType;
  loveType: LoveType;
}

// Diagnosis Result Storage Type
// Note: Nickname is stored separately in USER_PROFILE, not duplicated here
export type StoredDiagnosisResult = DiagnosisResult;

/**
 * Generic Session Storage wrapper with type safety
 */
class SessionStorageManager {
  /**
   * Save data to session storage
   */
  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to save to session storage (key: ${key}):`, error);
    }
  }

  /**
   * Get data from session storage
   */
  get<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to read from session storage (key: ${key}):`, error);
      return null;
    }
  }

  /**
   * Remove data from session storage
   */
  remove(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove from session storage (key: ${key}):`, error);
    }
  }

  /**
   * Clear all session storage
   */
  clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error("Failed to clear session storage:", error);
    }
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return sessionStorage.getItem(key) !== null;
  }
}

// Export singleton instance
export const storage = new SessionStorageManager();

/**
 * Typed storage helpers for specific data
 */
export const userProfileStorage = {
  save: (profile: StoredUserProfile) => {
    storage.set(STORAGE_KEYS.USER_PROFILE, profile);
  },
  get: (): StoredUserProfile | null => {
    return storage.get<StoredUserProfile>(STORAGE_KEYS.USER_PROFILE);
  },
  remove: () => {
    storage.remove(STORAGE_KEYS.USER_PROFILE);
  },
  exists: (): boolean => {
    return storage.has(STORAGE_KEYS.USER_PROFILE);
  },
};

export const diagnosisResultStorage = {
  save: (result: StoredDiagnosisResult) => {
    storage.set(STORAGE_KEYS.DIAGNOSIS_RESULT, result);
  },
  get: (): StoredDiagnosisResult | null => {
    return storage.get<StoredDiagnosisResult>(STORAGE_KEYS.DIAGNOSIS_RESULT);
  },
  remove: () => {
    storage.remove(STORAGE_KEYS.DIAGNOSIS_RESULT);
  },
  exists: (): boolean => {
    return storage.has(STORAGE_KEYS.DIAGNOSIS_RESULT);
  },
};
