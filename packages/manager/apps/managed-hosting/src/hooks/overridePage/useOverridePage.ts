import { UIMatch, useMatches } from 'react-router-dom';

type RouteHandle = {
  isOverridePage?: boolean;
};

type RouteMatch = UIMatch<unknown, RouteHandle>;

export const useOverridePage = (): boolean => {
  const matches = useMatches() as RouteMatch[];
  return matches.some((match) => match?.handle?.isOverridePage);
};
