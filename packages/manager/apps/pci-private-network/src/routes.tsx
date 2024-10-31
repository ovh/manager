import { getProjectQuery } from '@ovh-ux/manager-pci-common';
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
  onboarding: 'onboarding',
  globalRegions: '',
  localZone: 'localZone',
  delete: 'delete',
  new: 'new',
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
      {
        path: ROUTE_PATHS.onboarding,
        ...lazyRouteConfig(() => import('@/pages/onboarding/Onboarding.page')),
      },
      {
        path: ROUTE_PATHS.new,
        handle: {
          tracking: 'new',
        },
        ...lazyRouteConfig(() => import('@/pages/new/New.page')),
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
