import { useState, useEffect, useCallback } from "react";
import { storage } from "../utils/storage";

/**
 * Custom hook for managing session storage with React state sync
 *
 * @param key - Session storage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [value, setValue, removeValue]
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] {
  // Initialize state with value from session storage or initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = storage.get<T>(key);
    return item !== null ? item : initialValue;
  });

  // Update session storage when state changes
  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);
      storage.set(key, value);
    },
    [key]
  );

  // Remove from session storage
  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    storage.remove(key);
  }, [key, initialValue]);

  // Sync with storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Failed to parse storage event:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}
