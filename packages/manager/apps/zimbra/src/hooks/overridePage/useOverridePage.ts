import { useMatches } from 'react-router-dom';
import { RouteMatch } from '@/routes/routes';

export const useOverridePage = (): boolean => {
  const matches = useMatches() as RouteMatch[];
  return matches.some((match) => match?.handle?.isOverridePage);
};
