import React from 'react';
import NotFound from './../pages/404';
import ErrorBoundary from './../components/errorBoundary';

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
    path: '/pci/projects/:projectId/ai/dashbaord',
    ...lazyRouteConfig(() => import('@/pages')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages')),
      },
      /*
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
        ],
      },
      */
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
