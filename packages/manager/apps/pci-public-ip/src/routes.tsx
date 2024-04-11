import { Navigate } from 'react-router-dom';
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
  root: '/pci/projects/:projectId/public-ips',
  onboarding: 'onboarding',
  floatingIPs: 'floating-ips',
  floatingIPTerminate: ':ipId/terminate',
  floatingIPEdit: ':ipId/edit',
  additionalIPs: 'additional-ips',
  additionalIPTerminate: ':ipId/terminate',
  additionalIPEdit: ':ipId/edit',
  imports: 'imports',
  import: ':ip',
};

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    id: 'public-ips',
    path: ROUTE_PATHS.root,
    loader: async ({ params }) => {
      return queryClient.fetchQuery(getProjectQuery(params.projectId));
    },
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        element: <Navigate to={ROUTE_PATHS.floatingIPs} replace />,
      },
      {
        path: ROUTE_PATHS.floatingIPs,
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
        handle: {
          tracking: 'floatings-ips',
        },
        children: [
          {
            path: ROUTE_PATHS.floatingIPTerminate,
            ...lazyRouteConfig(() =>
              import('@/pages/floating-ips/terminate/TerminateFloatingIP.page'),
            ),
            handle: {
              tracking: 'terminate',
            },
          },
          {
            path: ROUTE_PATHS.floatingIPEdit,
            ...lazyRouteConfig(() =>
              import('@/pages/floating-ips/edit/EditInstance.page'),
            ),
            handle: {
              tracking: 'edit',
            },
          },
        ],
      },
      {
        path: ROUTE_PATHS.additionalIPs,
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
        handle: {
          tracking: 'failover-ips',
        },
        children: [
          {
            path: ROUTE_PATHS.additionalIPTerminate,
            ...lazyRouteConfig(() =>
              import(
                '@/pages/additional-ips/terminate/TerminateAdditionalIP.page'
              ),
            ),
            handle: {
              tracking: 'terminate',
            },
          },
          {
            path: ROUTE_PATHS.additionalIPEdit,
            ...lazyRouteConfig(() =>
              import('@/pages/additional-ips/edit/EditAdditionalIP.page'),
            ),
            handle: {
              tracking: 'edit',
            },
          },
        ],
      },
      {
        path: ROUTE_PATHS.imports,
        ...lazyRouteConfig(() => import('@/pages/imports/Imports.page')),
        children: [
          {
            path: ROUTE_PATHS.import,
            ...lazyRouteConfig(() => import('@/pages/imports/MoveIP.page')),
          },
        ],
      },
      {
        path: ROUTE_PATHS.onboarding,
        ...lazyRouteConfig(() => import('@/pages/onboarding/OnBoarding.page')),
        children: [],
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
