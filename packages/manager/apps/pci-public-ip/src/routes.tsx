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
        children: [
          {
            path: ':ipId/terminate',
            ...lazyRouteConfig(() =>
              import('@/pages/floating-ips/terminate/TerminateFloatingIPPage'),
            ),
          },
        ],
      },
      {
        path: 'additional-ips',
        ...lazyRouteConfig(() => import('@/pages/list/ListingPage')),
        children: [
          {
            path: ':ipId/terminate',
            ...lazyRouteConfig(() =>
              import(
                '@/pages/additional-ips/terminate/TerminateAdditionalIPPage'
              ),
            ),
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
