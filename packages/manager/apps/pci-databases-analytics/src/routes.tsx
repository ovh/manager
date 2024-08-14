import React from 'react';
import NotFound from './pages/404';
import ErrorBoundary from './components/errorBoundary';

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
    path: '/pci/projects/:projectId/databases-analytics/:category/services',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: '',
        id: 'services',
        ...lazyRouteConfig(() => import('@/pages')),
      },
      {
        path: 'new',
        id: 'create',
        ...lazyRouteConfig(() => import('@/pages/services/create')),
      },
      {
        path: ':serviceId',
        ...lazyRouteConfig(() => import('@/pages/services/[serviceId]/layout')),
        children: [
          {
            path: '',
            id: 'service.dashboard',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/dashboard'),
            ),
          },
          {
            path: 'users',
            id: 'service.users',
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
                id: 'service.backups',
                ...lazyRouteConfig(() =>
                  import('@/pages/services/[serviceId]/backups'),
                ),
              },
              {
                path: 'fork',
                id: 'service.fork',
                ...lazyRouteConfig(() =>
                  import('@/pages/services/[serviceId]/backups/fork'),
                ),
              },
            ],
          },
          {
            path: 'databases',
            id: 'service.databases',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/databases'),
            ),
          },
          {
            path: 'namespaces',
            id: 'service.namespaces',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/namespaces'),
            ),
          },
          {
            path: 'pools',
            id: 'service.pools',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/pools'),
            ),
          },
          {
            path: 'queries',
            id: 'service.queries',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/queries'),
            ),
          },
          {
            path: 'integrations',
            id: 'service.integrations',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/integrations'),
            ),
          },
          {
            path: 'metrics',
            id: 'service.metrics',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/metrics'),
            ),
          },
          {
            path: 'logs',
            id: 'service.logs',
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
                id: 'service.settings',
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
