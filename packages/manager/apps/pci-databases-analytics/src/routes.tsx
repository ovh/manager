import React from 'react';
import NotFound from './pages/404';

const lazyRouteConfig = (importFn: CallableFunction) => {
  return {
    lazy: async () => {
      const { default: moduleDefault, ...moduleExports } = await importFn();
      return {
        Component: moduleDefault,
        loader: moduleExports?.Loader,
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
    path: '/pci/projects/:projectId/databases-analytics/:category/services',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages')),
      },
      {
        path: 'new',
        ...lazyRouteConfig(() => import('@/pages/services/create')),
      },
      {
        path: ':serviceId',
        ...lazyRouteConfig(() => import('@/pages/services/[serviceId]/layout')),
        children: [
          {
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/dashboard'),
            ),
          },
          {
            path: 'users',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/users'),
            ),
          },
          {
            path: 'backups',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/backups/layout'),
            ),
            children: [
              {
                path: '',
                ...lazyRouteConfig(() =>
                  import('@/pages/services/[serviceId]/backups'),
                ),
              },
              {
                path: 'fork',
                ...lazyRouteConfig(() =>
                  import('@/pages/services/[serviceId]/backups/fork'),
                ),
              },
            ],
          },
          {
            path: 'databases',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/databases'),
            ),
          },
          {
            path: 'namespaces',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/namespaces'),
            ),
          },
          {
            path: 'pools',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/pools'),
            ),
          },
          {
            path: 'queries',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/queries'),
            ),
          },
          {
            path: 'integrations',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/integrations'),
            ),
          },
          {
            path: 'metrics',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/metrics'),
            ),
          },
          {
            path: 'logs',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/logs'),
            ),
          },
          {
            path: 'settings',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/settings/layout'),
            ),
            children: [
              {
                path: '',
                ...lazyRouteConfig(() =>
                  import('@/pages/services/[serviceId]/settings'),
                ),
              },
            ],
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
