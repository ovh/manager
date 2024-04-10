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

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    id: 'public-ips',
    path: '/pci/projects/:projectId/public-ips',
    loader: async ({ params }) => {
      return queryClient.fetchQuery(getProjectQuery(params.projectId));
    },
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        element: <Navigate to="floating-ips" replace />,
      },
      {
        path: 'floating-ips',
        ...lazyRouteConfig(() => import('@/pages/list/ListingPage')),
        handle: {
          tracking: 'floatings-ips',
        },
        children: [
          {
            path: ':ipId/terminate',
            ...lazyRouteConfig(() =>
              import('@/pages/floating-ips/terminate/TerminateFloatingIPPage'),
            ),
            handle: {
              tracking: 'terminate',
            },
          },
        ],
      },
      {
        path: 'additional-ips',
        ...lazyRouteConfig(() => import('@/pages/list/ListingPage')),
        handle: {
          tracking: 'failover-ips',
        },
        children: [
          {
            path: ':ipId/terminate',
            ...lazyRouteConfig(() =>
              import(
                '@/pages/additional-ips/terminate/TerminateAdditionalIPPage'
              ),
            ),
            handle: {
              tracking: 'terminate',
            },
          },
          {
            path: ':ipId/edit',
            ...lazyRouteConfig(() =>
              import('@/pages/additional-ips/edit/EditInstancePage'),
            ),
            handle: {
              tracking: 'edit',
            },
          },
        ],
      },
      {
        path: 'imports',
        ...lazyRouteConfig(() => import('@/pages/imports/ImportsPage')),
        children: [
          {
            path: ':ip',
            ...lazyRouteConfig(() => import('@/pages/imports/MoveIPPage')),
          },
        ],
      },
      {
        path: 'onboarding',
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
