import { getProjectQuery } from '@/api/hooks/useProject';
import queryClient from '@/queryClient';

const lazyRouteConfig = (importFn: CallableFunction) => ({
  lazy: async () => {
    const { default: moduleDefault, ...moduleExports } = await importFn();

    return {
      Component: moduleDefault,
      ...moduleExports,
    };
  },
});

export interface RouteHandle {
  tracking?: string;
}

export const ROUTE_PATHS = {
  root: '/pci/projects/:projectId/private-networks',
  globalRegions: '',
  localZone: 'localZone',
  delete: 'delete',
};

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    id: 'private-networks',
    path: ROUTE_PATHS.root,
    loader: async ({ params }) =>
      queryClient.fetchQuery(getProjectQuery(params.projectId)),
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: ROUTE_PATHS.globalRegions,
        handle: {
          tracking: 'globalRegions',
        },
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
        children: [
          {
            path: ROUTE_PATHS.delete,
            ...lazyRouteConfig(() =>
              import('@/pages/delete/DeleteNetwork.page'),
            ),
            handle: {
              tracking: 'delete',
            },
          },
        ],
      },
      {
        path: ROUTE_PATHS.localZone,
        handle: {
          tracking: 'localZone',
        },
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
        children: [
          {
            path: ROUTE_PATHS.delete,
            ...lazyRouteConfig(() =>
              import('@/pages/delete/DeleteNetwork.page'),
            ),
            handle: {
              tracking: 'delete',
            },
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
