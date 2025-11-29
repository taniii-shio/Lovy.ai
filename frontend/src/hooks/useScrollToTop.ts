import { useEffect } from "react";

/**
 * Custom hook to scroll to top of page on mount
 *
 * Useful for page components to ensure the user starts at the top
 */
export function useScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
}
