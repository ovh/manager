import { useResolvedPath } from 'react-router-dom';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { UseQueryResult } from '@tanstack/react-query';
import config from '@/hub.config';

export const useHubNavigation = (
  path: string,
): UseQueryResult<string, Error> => {
  const resolvedPath = useResolvedPath(path).pathname;

  return useNavigationGetUrl([
    config.rootLabel,
    resolvedPath,
    {},
  ]) as UseQueryResult<string, Error>;
};
