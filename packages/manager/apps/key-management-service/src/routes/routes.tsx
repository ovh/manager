import React from 'react';
import NotFound from '../pages/404';
import { ROUTES_URLS } from './routes.constants';

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

export const COMMON_PATH = '/key-management-service';

export default [
  {
    path: ROUTES_URLS.root,
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: ROUTES_URLS.listing,
        ...lazyRouteConfig(() => import('@/pages/listing')),
      },
      {
        path: ROUTES_URLS.createKeyManagementService,
        ...lazyRouteConfig(() => import('@/pages/create')),
      },
      {
        path: '/:serviceName',
        ...lazyRouteConfig(() => import('@/pages/dashboard')),
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
        path: ROUTES_URLS.onboarding,
        ...lazyRouteConfig(() => import('@/pages/onboarding')),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
