import { useRouteLoaderData, useSearchParams } from 'react-router-dom';
import { useLogger } from '@ovh-ux/manager-react-core-application';
import { ROUTE_IDS, ProjectRouteData } from '@/routes/routes.constant';

export const useProjectIdFromRoute = (): string => {
  const logger = useLogger();

  let routeProjectId: string | undefined;

  try {
    const routeData = useRouteLoaderData(ROUTE_IDS.PROJECT) as ProjectRouteData;
    routeProjectId = routeData?.projectId;
  } catch {
    // useRouteLoaderData is not available (e.g., in tests with MemoryRouter) or route is not properly configured
    logger.warn('Failed to get projectId from route data');
    routeProjectId = undefined;
  }

  if (routeProjectId) {
    return routeProjectId;
  }

  // Try to get projectId from search params
  let searchProjectId: string | null = null;

  try {
    const [searchParams] = useSearchParams();
    searchProjectId = searchParams.get('projectId');
  } catch {
    // useSearchParams is not available (e.g., in tests without Router)
    logger.warn('Failed to get projectId from search params');
    searchProjectId = null;
  }

  return searchProjectId || '';
};
