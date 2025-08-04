import { useRouteLoaderData, useSearchParams } from 'react-router-dom';
import { ROUTE_IDS, ProjectRouteData } from '@/routes/routes.constant';

export const useProjectIdFromRoute = (): string => {
  // Try to get projectId from route data first
  let routeProjectId: string | undefined;

  try {
    routeProjectId = (useRouteLoaderData(ROUTE_IDS.PROJECT) as ProjectRouteData)
      ?.projectId;
  } catch {
    // useRouteLoaderData is not available (e.g., in tests with MemoryRouter)
    routeProjectId = undefined;
  }

  // Only check search params if route data is not available
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
    searchProjectId = null;
  }

  return searchProjectId || '';
};
