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

const ROUTE_PATHS = {
  root: '/pci/projects/:projectId/gateway',
};

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    id: 'public-gateway',
    path: ROUTE_PATHS.root,
    loader: async ({ params }) =>
      queryClient.fetchQuery(getProjectQuery(params.projectId)),
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        handle: {
          tracking: 'public-gateway',
        },
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
        children: [
          {
            path: 'delete',
            ...lazyRouteConfig(() =>
              import('@/pages/delete/DeleteGateway.page'),
            ),
            handle: {
              tracking: 'delete',
            },
            children: [],
          },
        ],
      },
      {
        path: 'onboarding',
        ...lazyRouteConfig(() => import('@/pages/onboarding/OnBoarding.page')),
        children: [],
      },
      {
        path: 'new',
        ...lazyRouteConfig(() => import('@/pages/add/AddGateway.page')),
        children: [],
      },
      {
        path: 'edit',
        ...lazyRouteConfig(() => import('@/pages/edit/EditGateway.page')),
        handle: {
          tracking: 'edit',
        },
        children: [],
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
