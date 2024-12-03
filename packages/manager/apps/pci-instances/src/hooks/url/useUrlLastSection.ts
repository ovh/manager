import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export type TUseUrlLastSectionPredicateFn = (section: string) => boolean;

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
