import { useMatches } from 'react-router-dom';
import { Match } from '@/hooks';

export const useOverridePage = (): boolean => {
  const matches = useMatches() as Match[];
  return matches.some((match) => match.handle?.isOverridePage);
};
