import { useLocation } from 'react-router-dom';

export const usePathMatch = <T extends string>(regex: RegExp): T | null => {
  const location = useLocation();
  const match = location.pathname.match(regex);
  return match ? (match[0] as T) : null;
};
