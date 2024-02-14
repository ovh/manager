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
            path: 'metrics',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/metrics'),
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
