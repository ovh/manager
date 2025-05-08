import { useLocation } from 'react-router-dom';
import { getPathMatch } from '@/utils';

export const usePathMatch = <T extends string>(regex: RegExp): T | null => {
  const location = useLocation();
  return getPathMatch(location.pathname, regex);
};
