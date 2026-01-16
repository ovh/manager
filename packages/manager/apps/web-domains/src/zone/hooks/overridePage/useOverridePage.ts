import { RouteMatch } from '@/routes';
import { useMatches } from 'react-router-dom';


export const useOverridePage = (): boolean => {
  const matches = useMatches() as RouteMatch[];
  return matches.some((match) => match?.handle?.isOverridePage);
};
