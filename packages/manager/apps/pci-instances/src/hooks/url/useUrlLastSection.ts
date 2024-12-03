import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export type TUseUrlLastSectionPredicateFn = (section: string) => boolean;

/**
 * A custom React hook to extract the last section of the current URL path.
 *
 * @template T - A string type for the return value if the `predicateFn` is used to filter the result.
 *
 * @param {TUseUrlLastSectionPredicateFn} [predicateFn] - An optional predicate function to validate the last URL section.
 *   - This function receives the last section of the URL as a string and should return a boolean.
 *   - If the function returns `false`, the hook will return `null`.
 *
 * @returns {T | null} - The last section of the URL path if it exists and passes the `predicateFn` (if provided).
 *   - Returns `null` if the path is empty or if the last section does not pass the predicate function.
 *
 * @example
 * // URL: "/home/profile/42"
 * const lastSection = useUrlLastSection();
 * console.log(lastSection); // "42"
 */
export const useUrlLastSection = <T extends string>(
  predicateFn?: TUseUrlLastSectionPredicateFn,
): T | null => {
  const { pathname } = useLocation();

  return useMemo(() => {
    const sections = pathname.split('/').filter(Boolean);
    if (sections.length === 0) return null;
    const lastSection = sections[sections.length - 1];
    if (predicateFn && !predicateFn(lastSection)) return null;
    return lastSection as T;
  }, [pathname, predicateFn]);
};
