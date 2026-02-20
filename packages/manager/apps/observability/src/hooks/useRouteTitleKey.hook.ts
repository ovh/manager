import { useMatches } from 'react-router-dom';

import { RouteHandle } from '@/types/routeHandle.types';

export function useRouteTitleKey(): string | undefined {
  const matches = useMatches();
  const currentMatch = matches.find((match) => (match.handle as RouteHandle)?.titleKey);
  return (currentMatch?.handle as RouteHandle)?.titleKey;
}
