import { getProjectQuery } from '@ovh-ux/manager-pci-common';
import { PageType } from '@ovh-ux/manager-react-shell-client';
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

// TODO remove
export interface RouteHandle {
  tracking?: string;
}

const ROUTE_PATHS = {
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
        id: 'globalRegions',
        path: ROUTE_PATHS.globalRegions,
        handle: {
          tracking: {
            pageName: 'globalRegions',
            pageType: PageType.listing,
          },
        },
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
        children: [
          {
            id: 'delete-global-regions',
            path: ROUTE_PATHS.delete,
            ...lazyRouteConfig(() =>
              import('@/pages/delete/DeleteNetwork.page'),
            ),
            handle: {
              tracking: {
                pageName: 'delete',
                pageType: PageType.dashboard,
              },
            },
          },
        ],
      },
      {
        id: 'localZone',
        path: ROUTE_PATHS.localZone,
        handle: {
          tracking: {
            pageName: 'localZone',
            pageType: PageType.listing,
          },
        },
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
        children: [
          {
            id: 'delete-local-zone',
            path: ROUTE_PATHS.delete,
            ...lazyRouteConfig(() =>
              import('@/pages/delete/DeleteNetwork.page'),
            ),
            handle: {
              tracking: {
                pageName: 'delete',
                pageType: PageType.dashboard,
              },
            },
          },
        ],
      },
      {
        id: 'onboarding',
        path: ROUTE_PATHS.onboarding,
        ...lazyRouteConfig(() => import('@/pages/onboarding/Onboarding.page')),
        handle: {
          tracking: {
            pageName: 'onboarding',
            pageType: PageType.onboarding,
          },
        },
      },
      {
        id: 'new',
        path: ROUTE_PATHS.new,
        handle: {
          tracking: {
            pageName: 'new',
            pageType: PageType.dashboard,
          },
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
