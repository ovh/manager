import { getProjectQuery } from '@/api/hooks/useProject';
import queryClient from '@/queryClient';

const lazyRouteConfig = (importFn: CallableFunction) => {
  return {
    lazy: async () => {
      const { default: moduleDefault, ...moduleExports } = await importFn();

      return {
        Component: moduleDefault,
        ...moduleExports,
      };
    },
  };
};

export interface RouteHandle {
  tracking?: string;
}

export const ROUTE_PATHS = {
  root: '/pci/projects/:projectId/private-networks',
  globalRegions: '',
  localZone: 'localZone',
};

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    id: 'private-networks',
    path: ROUTE_PATHS.root,
    loader: async ({ params }) => {
      return queryClient.fetchQuery(getProjectQuery(params.projectId));
    },
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: ROUTE_PATHS.globalRegions,
        handle: {
          tracking: 'globalRegions',
        },
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
      },
      {
        path: ROUTE_PATHS.localZone,
        handle: {
          tracking: 'localZone',
        },
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
