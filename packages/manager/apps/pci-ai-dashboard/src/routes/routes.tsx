import React from 'react';
import NotFound from '@/pages/404.page';
import ErrorBoundary from '@/components/error-boundary/ErrorBoundary.component';

const lazyRouteConfig = (importFn: CallableFunction) => {
  return {
    lazy: async () => {
      const { default: moduleDefault, ...moduleExports } = await importFn();
      return {
        Component: moduleDefault,
        loader: moduleExports?.Loader,
        ErrorBoundary,
        handle: {
          breadcrumb: moduleExports.breadcrumb,
        },
        ...moduleExports,
      };
    },
  };
};

export const COMMON_PATH = '/pci/projects';

export default [
  {
    path: '/pci/projects/:projectId/ai/dashboard',
    ...lazyRouteConfig(() => import('@/pages/root.layout')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/dashboard/dashboard.layout')),
        children: [
          {
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/home/home.page'),
            ),
          },
          {
            path: 'users',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/users/users.page'),
            ),
          },
          {
            path: 'tokens',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/tokens/tokens.page'),
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
