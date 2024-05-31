import React from 'react';
import { RouteObject } from 'react-router-dom';
import NotFound from './pages/404';

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
    path: '/pci/projects/:projectId/file-storage',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        id: 'listing',
        path: '',
        ...lazyRouteConfig(() => import('@/pages/listing')),
      },
      {
        path: ':regionName/:serviceName',
        ...lazyRouteConfig(() => import('@/pages/dashboard/_layout')),
        children: [
          {
            id: 'dashboard',
            path: '',
            ...lazyRouteConfig(() => import('@/pages/dashboard/index')),
          },
          {
            id: 'dashboard.tab2',
            path: 'Tab2',
            ...lazyRouteConfig(() => import('@/pages/dashboard/Tab2')),
          },
        ],
      },
      {
        id: 'onboarding',
        path: 'onboarding',
        ...lazyRouteConfig(() => import('@/pages/onboarding')),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
