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
    ...lazyRouteConfig(() => import('@/pages/Root.layout')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.layout')),
        children: [
          {
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/home/Home.page'),
            ),
          },
          {
            path: 'users',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/users/Users.page'),
            ),
          },
          {
            path: 'tokens',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/tokens/Tokens.page'),
            ),
          },
          {
            path: 'docker-registries',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/docker/Docker.page'),
            ),
          },
          {
            path: 'git-registries',
            ...lazyRouteConfig(() => import('@/pages/dashboard/git/Git.page')),
          },
          {
            path: 'datastore',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/datastore/Datastore.page'),
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
