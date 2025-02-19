import React from 'react';
import { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/404';

const lazyRouteConfig = (importFn: CallableFunction): Partial<RouteObject> => {
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

export const Routes: any = [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/dashboard/dashboard')),
        handle: {
          tracking: {
            pageName: 'dashboard',
          },
        },
      },
      {
        path: 'roadmap-changelog',
        ...lazyRouteConfig(() => import('@/pages/changelog/changelog')),
        handle: {
          tracking: {
            pageName: 'roadmap-changelog',
          },
        },
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
