import React from 'react';
import NotFound from './pages/404';

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

export const COMMON_PATH = '/key-management-system';

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: '/',
        ...lazyRouteConfig(() => import('@/pages/listing')),
      },
      {
        path: '/:serviceName',
        ...lazyRouteConfig(() => import('@/pages/dashboard/_layout')),
        children: [
          {
            path: '',
            ...lazyRouteConfig(() => import('@/pages/dashboard/Tabs1')),
          },
          {
            path: 'Tabs2',
            ...lazyRouteConfig(() => import('@/pages/dashboard/Tabs2')),
          },
        ],
      },
      {
        path: '/onboarding',
        ...lazyRouteConfig(() => import('@/pages/onboarding')),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
